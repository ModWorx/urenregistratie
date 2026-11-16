"use strict";
/* Rooktest: laadt het inline script van index.html in een minimale
   DOM-stub en controleert dat de app initialiseert en de kernfuncties
   (daginfo, saldi, caches, back-upvalidatie, klok) werken. */
const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "..", "index.html");
const html = fs.readFileSync(htmlPath, "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if(!m){ console.error("FAIL: geen <script> gevonden in index.html"); process.exit(1); }

let code = m[1];
code += "\n;globalThis.__APP=APP;globalThis.__saveStorage=saveStorage;globalThis.__todayIso=todayIso;globalThis.__valideerBackup=valideerBackup;";

function el(){
 return { style:{}, className:"", classList:{ add(){}, remove(){} },
  textContent:"", innerHTML:"", value:"",
  appendChild(){}, remove(){}, click(){}, href:"", download:"" };
}
const els = {};
global.document = {
 getElementById(id){ return els[id] || (els[id] = el()); },
 querySelectorAll(){ return []; },
 createElement(){ return el(); },
 body:{ appendChild(){}, removeChild(){} }
};
global.window = { onerror:null, scrollTo(){}, print(){} };
global.localStorage = {
 _s:{},
 getItem(k){ return this._s[k] || null; },
 setItem(k,v){ this._s[k] = v; },
 removeItem(k){ delete this._s[k]; }
};
global.confirm = () => true;
global.alert = () => {};
global.Blob = class {};
global.URL = { createObjectURL: () => "blob:x", revokeObjectURL(){} };
global.FileReader = class { readAsText(){} };
global.setInterval = () => 0;
global.clearInterval = () => {};
global.setTimeout = () => 0;

let fouten = 0;
function check(naam, ok){
 console.log((ok ? "OK  " : "FAIL") + " " + naam);
 if(!ok){ fouten++; }
}

eval(code);
const APP = globalThis.__APP;
const saveStorage = globalThis.__saveStorage;
const todayIso = globalThis.__todayIso;
const valideerBackup = globalThis.__valideerBackup;

check("initialisatie zonder fouten", !!(APP && APP.set && APP.set.dayHrs === 8));

const vandaag = todayIso();
APP.days[vandaag] = { date:vandaag, type:"werk", start:"09:00", end:"17:00", brk:30, note:"testnotitie" };
saveStorage();
APP.render_dashboard();
check("gewerkte tijd correct (7u30 = 450 min)", APP.dagInfo(vandaag).gw === 450);
check("notitie met potlood-teken op dashboard", els["dayDetailHeader"].innerHTML.indexOf("\u270E") >= 0);

const jaar = String(new Date().getFullYear());
const kerst = jaar + "-12-25";
const voor = JSON.stringify(APP.dagInfo(kerst));
APP.sh[jaar] = { "9": kerst };
saveStorage();
check("feestCache-invalidering bij verschuiving", JSON.stringify(APP.dagInfo(kerst)) !== voor);

let gegooid = false;
try{ valideerBackup({ days: "x" }); }catch(e){ gegooid = true; }
check("valideerBackup weigert corrupt bestand", gegooid);
let geaccepteerd = true;
try{ valideerBackup({ days: {} }); }catch(e){ geaccepteerd = false; }
check("valideerBackup accepteert minimale back-up", geaccepteerd);

APP.clock = { started: Date.now() - 3600000, day: vandaag, pausedAt: null, brkBase: 0 };
APP.klokStop();
check("klokStop sluit timer af", APP.clock === null && APP.days[vandaag].type === "werk");

check("saldoTot geeft getal", typeof APP.saldoTot() === "number");

if(fouten){ console.error(fouten + " test(en) gefaald"); process.exit(1); }
console.log("Alle rooktests geslaagd");
