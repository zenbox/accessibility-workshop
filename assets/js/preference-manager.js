/**
 * Präferenz-Manager
 * Verwaltet Benutzereinstellungen für Darstellungspräferenzen und speichert sie im localStorage
 */

const PreferenceManager = (() => {
    // Auflistung aller verfügbaren Präferenzen
    const PREFERENCES = {
        REDUCED_MOTION: "reducedMotion",
        HIGH_CONTRAST: "highContrast",
        DARK_MODE: "darkMode",
        FORCED_COLORS: "forcedColors",
        REDUCED_DATA: "reducedData",
        REDUCED_TRANSPARENCY: "reducedTransparency",
        INVERTED_COLORS: "invertedColors",
    }

    // Zuordnung von Präferenzen zu HTML-Klassen
    const CLASS_MAPPINGS = {
        [PREFERENCES.REDUCED_MOTION]: "reduced-motion",
        [PREFERENCES.HIGH_CONTRAST]: "high-contrast-mode",
        [PREFERENCES.DARK_MODE]: "dark-mode",
        [PREFERENCES.FORCED_COLORS]: "forced-colors",
        [PREFERENCES.REDUCED_DATA]: "reduced-data",
        [PREFERENCES.REDUCED_TRANSPARENCY]: "reduced-transparency",
        [PREFERENCES.INVERTED_COLORS]: "inverted-colors-mode",
    }

    // Media-Query-Mappings für automatische Erkennung
    const MEDIA_QUERY_MAPPINGS = {
        [PREFERENCES.REDUCED_MOTION]: "(prefers-reduced-motion: reduce)",
        [PREFERENCES.HIGH_CONTRAST]: "(prefers-contrast: more)",
        [PREFERENCES.DARK_MODE]: "(prefers-color-scheme: dark)",
        [PREFERENCES.FORCED_COLORS]: "(forced-colors: active)",
        [PREFERENCES.REDUCED_DATA]: "(prefers-reduced-data: reduce)",
        [PREFERENCES.REDUCED_TRANSPARENCY]:
            "(prefers-reduced-transparency: reduce)",
        [PREFERENCES.INVERTED_COLORS]: "(inverted-colors: inverted)",
    }

    // LocalStorage-Schlüssel
    const STORAGE_KEY = "userPreferences"

    // Standardwerte für Präferenzen
    let preferences = {
        [PREFERENCES.REDUCED_MOTION]: false,
        [PREFERENCES.HIGH_CONTRAST]: false,
        [PREFERENCES.DARK_MODE]: false,
        [PREFERENCES.FORCED_COLORS]: false,
        [PREFERENCES.REDUCED_DATA]: false,
        [PREFERENCES.REDUCED_TRANSPARENCY]: false,
        [PREFERENCES.INVERTED_COLORS]: false,
    }

    /**
     * Initialisiert den Präferenz-Manager
     */
    function init() {
        loadPreferences()
        setupMediaQueryListeners()
        applyPreferences()
        setupEventListeners()
    }

    /**
     * Lädt Präferenzen aus dem localStorage
     */
    function loadPreferences() {
        try {
            const savedPreferences = localStorage.getItem(STORAGE_KEY)
            if (savedPreferences) {
                preferences = {
                    ...preferences,
                    ...JSON.parse(savedPreferences),
                }
            }
        } catch (error) {
            console.error("Fehler beim Laden der Präferenzen:", error)
        }
    }

    /**
     * Richtet Media-Query-Listener für automatische Präferenzanpassung ein
     */
    function setupMediaQueryListeners() {
        Object.entries(MEDIA_QUERY_MAPPINGS).forEach(([pref, query]) => {
            const mediaQuery = window.matchMedia(query)

            // Initialen Zustand überprüfen, aber nur wenn keine explizite Benutzerpräferenz gesetzt ist
            if (localStorage.getItem(STORAGE_KEY) === null) {
                preferences[pref] = mediaQuery.matches
            }

            // Listener für Änderungen einrichten
            mediaQuery.addEventListener("change", (e) => {
                // Nur aktualisieren, wenn der Benutzer keine explizite Einstellung vorgenommen hat
                if (!hasUserExplicitlySet(pref)) {
                    preferences[pref] = e.matches
                    applyPreferences()
                    updateToggleStates()
                }
            })
        })
    }

    /**
     * Überprüft, ob eine Präferenz explizit vom Benutzer gesetzt wurde
     */
    function hasUserExplicitlySet(preference) {
        try {
            const savedPreferences = localStorage.getItem(STORAGE_KEY)
            if (savedPreferences) {
                const parsed = JSON.parse(savedPreferences)
                return preference in parsed
            }
        } catch (error) {
            console.error(
                "Fehler beim Überprüfen der Benutzerpräferenzen:",
                error
            )
        }
        return false
    }

    /**
     * Speichert Präferenzen im localStorage
     */
    function savePreferences() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
        } catch (error) {
            console.error("Fehler beim Speichern der Präferenzen:", error)
        }
    }

    /**
     * Wendet alle Präferenzen auf das HTML-Element an
     */
    function applyPreferences() {
        const htmlElement = document.documentElement

        // Für jede Präferenz die entsprechende Klasse hinzufügen oder entfernen
        Object.entries(preferences).forEach(([pref, isEnabled]) => {
            const className = CLASS_MAPPINGS[pref]
            if (className) {
                if (isEnabled) {
                    htmlElement.classList.add(className)
                } else {
                    htmlElement.classList.remove(className)
                }
            }
        })
    }

    /**
     * Aktualisiert den Zustand aller Toggle-Schalter
     */
    function updateToggleStates() {
        Object.entries(preferences).forEach(([pref, isEnabled]) => {
            const toggle = document.querySelector(`#toggle-${pref}`)
            if (toggle) {
                toggle.checked = isEnabled
            }
        })
    }

    /**
     * Richtet Event-Listener für die Toggle-Schalter ein
     */
    function setupEventListeners() {
        Object.keys(preferences).forEach((pref) => {
            const toggle = document.querySelector(`#toggle-${pref}`)
            if (toggle) {
                toggle.checked = preferences[pref]
                toggle.addEventListener("change", (e) => {
                    preferences[pref] = e.target.checked
                    savePreferences()
                    applyPreferences()
                })
            }
        })
    }

    /**
     * Setzt eine einzelne Präferenz
     */
    function setPreference(preference, value) {
        if (preference in preferences) {
            preferences[preference] = value
            savePreferences()
            applyPreferences()
            updateToggleStates()
        }
    }

    /**
     * Gibt den Wert einer Präferenz zurück
     */
    function getPreference(preference) {
        return preferences[preference] || false
    }

    /**
     * Setzt alle Präferenzen zurück
     */
    function resetPreferences() {
        Object.keys(preferences).forEach((pref) => {
            preferences[pref] = false
        })
        savePreferences()
        applyPreferences()
        updateToggleStates()
    }

    // Öffentliche API
    return {
        init,
        setPreference,
        getPreference,
        resetPreferences,
        PREFERENCES,
    }
})()

// Überprüfen Sie die JS-Konsole auf Fehler
console.log("Preference Manager wird initialisiert...");

// Überprüfen Sie, ob alle DOM-Elemente korrekt gefunden werden
document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('input[id^="toggle-"]');
  console.log("Gefundene Toggle-Elemente:", toggles.length);
  
  toggles.forEach(toggle => {
    console.log("Toggle ID:", toggle.id);
    toggle.addEventListener('change', (e) => {
      const prefName = toggle.id.replace('toggle-', '');
      console.log(`${prefName} wurde auf ${e.target.checked} gesetzt`);
      
      // HTML-Klasse entsprechend setzen
      const htmlElement = document.documentElement;
      const className = mapPrefToClass(prefName);
      
      if (e.target.checked) {
        htmlElement.classList.add(className);
      } else {
        htmlElement.classList.remove(className);
      }
      
      // In localStorage speichern
      savePreference(prefName, e.target.checked);
    });
  });
  
  // Initialen Zustand aus localStorage laden
  loadPreferences();
});

// Hilfsfunktion zur Zuordnung von Präferenznamen zu CSS-Klassen
function mapPrefToClass(prefName) {
  const mapping = {
    'darkMode': 'dark-mode',
    'highContrast': 'high-contrast-mode',
    'invertedColors': 'inverted-colors-mode',
    'forcedColors': 'forced-colors',
    'reducedMotion': 'reduced-motion',
    'reducedData': 'reduced-data',
    'reducedTransparency': 'reduced-transparency'
  };
  
  return mapping[prefName] || prefName;
}

// Präferenzen speichern
function savePreference(name, value) {
  try {
    let prefs = {};
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      prefs = JSON.parse(saved);
    }
    
    prefs[name] = value;
    localStorage.setItem('userPreferences', JSON.stringify(prefs));
    console.log("Präferenz gespeichert:", name, value);
  } catch (error) {
    console.error("Fehler beim Speichern der Präferenz:", error);
  }
}

// Präferenzen laden und anwenden
function loadPreferences() {
  try {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      const prefs = JSON.parse(saved);
      console.log("Geladene Präferenzen:", prefs);
      
      Object.entries(prefs).forEach(([name, value]) => {
        const toggle = document.getElementById(`toggle-${name}`);
        if (toggle) {
          toggle.checked = value;
          
          // Klasse auf HTML-Element anwenden
          const htmlElement = document.documentElement;
          const className = mapPrefToClass(name);
          
          if (value) {
            htmlElement.classList.add(className);
          } else {
            htmlElement.classList.remove(className);
          }
        }
      });
    }
  } catch (error) {
    console.error("Fehler beim Laden der Präferenzen:", error);
  }
}

// Reset-Button
const resetButton = document.getElementById('reset-preferences');
if (resetButton) {
  resetButton.addEventListener('click', () => {
    localStorage.removeItem('userPreferences');
    document.querySelectorAll('input[id^="toggle-"]').forEach(toggle => {
      toggle.checked = false;
    });
    
    // Alle Klassen entfernen
    document.documentElement.className = '';
    
    console.log("Präferenzen zurückgesetzt");
  });
}
