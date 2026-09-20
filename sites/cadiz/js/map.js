/* map.js — die Karte in der Ecke.
 *
 * Extern statt inline, weil die Site-CSP Inline-Skripte verbietet (script-src 'self').
 *
 * Die Karte ist ein Werkzeug, kein Einstieg: Sie liegt dauerhaft in der Ecke,
 * zeigt im Hover, dass dahinter etwas liegt, und oeffnet sich auf Klick. Ein
 * Ort darin fuehrt zu dem Tag, an dem wir dort waren.
 *
 * Ohne JavaScript bleibt die Seite vollstaendig lesbar — die Tage stehen
 * ohnehin untereinander. Die Karte ist dann schlicht nicht da.
 */
(function () {
	"use strict";

	var openBtn = document.getElementById("map-open");
	var dialog = document.getElementById("map-dialog");
	var closeBtn = document.getElementById("map-close");

	if (!openBtn || !dialog || typeof dialog.showModal !== "function") {
		// Kein <dialog>-Support: die Schaltflaeche waere eine Attrappe. Weg damit.
		if (openBtn) {
			openBtn.hidden = true;
		}
		return;
	}

	openBtn.addEventListener("click", function () {
		dialog.showModal();
	});

	closeBtn.addEventListener("click", function () {
		dialog.close();
	});

	// Klick auf den Hintergrund schliesst. Das Blatt selbst faengt seine Klicks ab.
	dialog.addEventListener("click", function (event) {
		if (event.target === dialog) {
			dialog.close();
		}
	});

	// Ein Ort fuehrt zum Tag: erst schliessen, dann springen, damit das Ziel
	// sichtbar ist und der Fokus dort landet.
	dialog.addEventListener("click", function (event) {
		var link = event.target.closest ? event.target.closest(".maproute__link") : null;
		if (!link) {
			return;
		}
		event.preventDefault();
		var id = link.getAttribute("href").slice(1);
		var target = document.getElementById(id);
		dialog.close();
		if (target) {
			target.scrollIntoView({ block: "center" });
			target.setAttribute("tabindex", "-1");
			target.focus({ preventScroll: true });
		}
	});

	// Nach dem Schliessen gehoert der Fokus zurueck auf die Schaltflaeche,
	// ausser der Sprung hat ihn schon woanders hingesetzt.
	dialog.addEventListener("close", function () {
		if (document.activeElement === document.body) {
			openBtn.focus();
		}
	});
})();
