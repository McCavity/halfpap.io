/* popouts.js — die Blätter in der Ecke: Karte und Hinweis zur Seite.
 *
 * Extern statt inline, weil die Site-CSP Inline-Skripte verbietet (script-src 'self').
 *
 * Beide sind Werkzeuge, keine Einstiege: Sie liegen dauerhaft in der Ecke,
 * zeigen im Hover, dass dahinter etwas liegt, und oeffnen sich auf Klick.
 * In der Karte fuehrt ein Ort zu dem Tag, an dem wir dort waren.
 *
 * Ohne JavaScript bleibt die Seite vollstaendig lesbar — die Tage stehen
 * ohnehin untereinander. Die Blaetter sind dann schlicht nicht da.
 */
(function () {
	"use strict";

	// Ein Blatt: Schaltflaeche, Dialog, Schliessen-Knopf. Fehlt eines davon
	// oder kann der Browser kein <dialog>, wird die Schaltflaeche versteckt —
	// eine Attrappe waere schlimmer als nichts.
	function blatt(btnId, dialogId, closeId) {
		var openBtn = document.getElementById(btnId);
		var dialog = document.getElementById(dialogId);
		var closeBtn = document.getElementById(closeId);

		if (!openBtn || !dialog || typeof dialog.showModal !== "function") {
			if (openBtn) {
				openBtn.hidden = true;
			}
			return null;
		}

		openBtn.addEventListener("click", function () {
			dialog.showModal();
		});

		if (closeBtn) {
			closeBtn.addEventListener("click", function () {
				dialog.close();
			});
		}

		// Klick auf den Hintergrund schliesst. Das Blatt selbst faengt seine Klicks ab.
		dialog.addEventListener("click", function (event) {
			if (event.target === dialog) {
				dialog.close();
			}
		});

		// Nach dem Schliessen gehoert der Fokus zurueck auf die Schaltflaeche,
		// ausser der Sprung hat ihn schon woanders hingesetzt.
		dialog.addEventListener("close", function () {
			if (document.activeElement === document.body) {
				openBtn.focus();
			}
		});

		return dialog;
	}

	var karte = blatt("map-open", "map-dialog", "map-close");
	blatt("note-open", "note-dialog", "note-close");

	// Ein Ort fuehrt zum Tag. Zeigt er auf einen Anker DIESER Seite, wird der
	// Sprung selbst ausgefuehrt, damit der Dialog vorher schliesst und der Fokus
	// am Ziel landet. Ein Link auf eine Kapitelseite wird NICHT abgefangen — er
	// soll ganz normal navigieren.
	if (karte) {
		karte.addEventListener("click", function (event) {
			var pin = event.target.closest ? event.target.closest(".maproute__pin") : null;
			if (!pin) {
				return;
			}
			var href = pin.getAttribute("href") || "";
			if (href.charAt(0) !== "#") {
				return;
			}
			event.preventDefault();
			var target = document.getElementById(href.slice(1));
			karte.close();
			if (target) {
				target.scrollIntoView({ block: "center" });
				target.setAttribute("tabindex", "-1");
				target.focus({ preventScroll: true });
			}
		});
	}
})();
