"use strict";
var CACHED = "uren-v1";
var BESTANDEN = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"];

self.addEventListener("install", function(e){
 e.waitUntil(caches.open(CACHED).then(function(c){ return c.addAll(BESTANDEN); }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener("activate", function(e){
 e.waitUntil(caches.keys().then(function(keys){
  return Promise.all(keys.filter(function(k){ return k !== CACHED; }).map(function(k){ return caches.delete(k); }));
 }).then(function(){ return self.clients.claim(); }));
});

self.addEventListener("fetch", function(e){
 if(e.request.method !== "GET"){ return; }
 if(e.request.mode === "navigate"){
  e.respondWith(fetch(e.request).then(function(resp){
   var kopie = resp.clone();
   caches.open(CACHED).then(function(c){ c.put(e.request, kopie); });
   return resp;
  }).catch(function(){ return caches.match("./index.html"); }));
  return;
 }
 e.respondWith(caches.match(e.request).then(function(hit){
  return hit || fetch(e.request);
 }));
});
