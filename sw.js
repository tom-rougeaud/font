/*
  Projet : Pimp My Font  ·  Version : 0.5.1  ·  Date : 25/11/2026
  Auteur : Tom Rougeaud  ·  Licence : CC BY-NC 4.0
  Réalisé avec l’aide de l’IA : Claude Sonnet 5.5 (Anthropic)
  Service worker : garde l’appli en mémoire pour qu’elle marche sans connexion.
*/
/* ===== SECTION : Constantes ===== */
/* Changer ce nom à chaque nouvelle version : sinon les anciens fichiers restent servis. */
const NOM_CACHE = "pimpmypolice-v0.5.1";
const FICHIERS = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./apple-touch-icon.png"];

/* ===== SECTION : Installation : met les fichiers en cache ===== */
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(NOM_CACHE).then((c) => c.addAll(FICHIERS)));
});
/* Le (la) visiteur(se) accepte la mise à jour : la page envoie ce message. */
self.addEventListener("message", (e) => { if (e.data === "activer") self.skipWaiting(); });

/* ===== SECTION : Activation : supprime les anciens caches ===== */
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((noms) => Promise.all(noms.filter((n) => n !== NOM_CACHE).map((n) => caches.delete(n)))).then(() => self.clients.claim()));
});

/* ===== SECTION : Requêtes : cache d’abord, réseau en secours ===== */
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request).catch(() => caches.match("./index.html"))));
});
