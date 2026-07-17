/* genesis.js — Wiedergabe-Steuerung fuer das Genesis-Timelapse.
 *
 * Extern statt inline, weil die Site-CSP Inline-Scripts verbietet
 * (script-src 'self'). Zwei Ziele:
 *   1. Barrierefreiheit: Bei "Bewegung reduzieren" (prefers-reduced-motion)
 *      bleibt das Poster-Standbild stehen; nichts wird geladen, nichts spielt.
 *   2. Bandbreite: Das Video hat preload="none" und kein autoplay-Attribut.
 *      Es laedt und spielt erst, wenn es ins Sichtfeld scrollt, und pausiert,
 *      wenn es wieder heraus scrollt. Ohne JS (oder ohne IntersectionObserver
 *      bei reduzierter Bewegung) sieht man schlicht das Poster.
 */
(function () {
	"use strict";

	var video = document.getElementById("genesis-timelapse");
	if (!video) return;

	var reduceMotion = window.matchMedia
		? window.matchMedia("(prefers-reduced-motion: reduce)")
		: { matches: false };

	// Bewegung reduziert: Poster stehen lassen, nichts laden, nichts abspielen.
	if (reduceMotion.matches) return;

	function play() {
		var p = video.play();
		if (p && typeof p.catch === "function") {
			p.catch(function () {
				/* Autoplay ggf. blockiert — kein Drama, Poster bleibt. */
			});
		}
	}

	if ("IntersectionObserver" in window) {
		var io = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						play();
					} else {
						video.pause();
					}
				});
			},
			{ threshold: 0.25 }
		);
		io.observe(video);
	} else {
		play();
	}
})();
