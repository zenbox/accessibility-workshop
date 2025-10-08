(function () {
  // Hilfen
  const $ = (sel, root = document) => root.querySelector(sel);
  const parseQuery = () => Object.fromEntries(new URLSearchParams(location.search));

  // Phase laden
  const { phase } = parseQuery();
  const cfg = window.PHASE_PROMPTS?.[phase] || null;

  const titleEl = document.getElementById('phase-title');
  const subEl   = document.getElementById('phase-subtitle');
  const footEl  = document.getElementById('footnote');
  const logEl   = document.getElementById('chat-log');
  const formEl  = document.getElementById('chat-form');
  const inputEl = document.getElementById('user-input');
  const resetEl = document.getElementById('reset-thread');

  // Threadzustand
  let thread = [];
  const role = localStorage.getItem('a11y.role') || 'pm';

  // UI initialisieren
  function initUI() {
    if (!cfg) {
      titleEl.textContent = "Unbekannte Phase";
      subEl.textContent = "Bitte kehre zur Übersicht zurück.";
      addBot("Ich kenne diese Phase nicht. Wähle eine Phase auf der Startseite.");
      return;
    }
    titleEl.textContent = cfg.title;
    subEl.textContent   = cfg.subtitle;
    footEl.textContent  = cfg.footnote;

    // Systemprompt + Starter
    addSystem(cfg.system, role, phase);
    if (cfg.starter) addBot(cfg.starter);

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        formEl.requestSubmit();
      }
    });

    formEl.addEventListener('submit', onSubmit);
    resetEl.addEventListener('click', resetThread);

    inputEl.focus();
  }

  // Nachrichtenrendering – simpel, mit Codeblock-Erkennung für ```...```
  function addMsg(text, who = 'bot') {
    const wrap = document.createElement('div');
    wrap.className = `msg ${who}`;
    wrap.setAttribute('tabindex', '0');

    // primitive Markdown-Codeblock-Handhabung
    const triple = /```([\s\S]*?)```/g;
    if (triple.test(text)) {
      // Splitten in Text und Codeblöcke
      let lastIndex = 0;
      triple.lastIndex = 0;
      const frag = document.createDocumentFragment();
      let m;
      while ((m = triple.exec(text)) !== null) {
        const before = text.slice(lastIndex, m.index);
        if (before.trim()) {
          const p = document.createElement('p');
          p.textContent = before.trim();
          frag.appendChild(p);
        }
        const pre = document.createElement('pre');
        pre.textContent = m[1].replace(/^\n|\n$/g, '');
        frag.appendChild(pre);
        lastIndex = triple.lastIndex;
      }
      const after = text.slice(lastIndex).trim();
      if (after) {
        const p = document.createElement('p');
        p.textContent = after;
        frag.appendChild(p);
      }
      wrap.appendChild(frag);
    } else {
      const p = document.createElement('p');
      p.textContent = text;
      wrap.appendChild(p);
    }

    logEl.appendChild(wrap);
    // ans Ende scrollen
    wrap.scrollIntoView({ block: 'end' });
    // Screenreader-Hinweis
    wrap.focus();
  }

  const addBot  = (t) => { thread.push({ role:'assistant', content:t }); addMsg(t, 'bot'); };
  const addUser = (t) => { thread.push({ role:'user',      content:t }); addMsg(t, 'user'); };
  const addSystem = (sys, role, phase) => {
    const system = `${sys}\n\n[Kontext] Rolle: ${role}. Phase: ${phase}.`;
    thread = [{ role:'system', content: system }];
  };

  async function onSubmit(e) {
    e.preventDefault();
    const text = (inputEl.value || '').trim();
    if (!text) return;

    addUser(text);
    inputEl.value = '';

    // Ladeanzeige
    const thinkingId = showThinking();

    try {
      const reply = await sendMessageToLLM(thread);
      hideThinking(thinkingId);
      addBot(reply);
      thread.push({ role:'assistant', content: reply });
    } catch (err) {
      hideThinking(thinkingId);
      addBot("Es gab ein technisches Problem. Bitte versuche es erneut.");
      console.error(err);
    }
  }

  function resetThread() {
    thread = [];
    logEl.innerHTML = '';
    addSystem(cfg?.system || '', role, phase || '');
    if (cfg?.starter) addBot(cfg.starter);
    inputEl.focus();
  }

  // dezente „…denkt…“ Anzeige
  function showThinking() {
    const el = document.createElement('div');
    el.className = 'msg bot';
    el.setAttribute('aria-live', 'polite');
    el.textContent = "…";
    logEl.appendChild(el);
    el.scrollIntoView({ block: 'end' });
    return el;
  }
  function hideThinking(el) {
    if (!el || !el.remove) return;
    el.remove();
  }

  // API-Stub – hier später dein Backend anschließen
  async function sendMessageToLLM(messages) {
    // Beispiel-Fetch – passe den Pfad/Body an dein Backend an:
    // const res = await fetch('/api/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ messages })
    // });
    // const data = await res.json();
    // return data.reply;

    // Vorläufige Simulation, bis dein Backend steht:
    const lastUser = messages.slice().reverse().find(m => m.role === 'user')?.content || '';
    // Minimale phasenabhängige Antwortlogik (nur Demo)
    if (phase === 'einstieg') {
      return "Spannend! Welche Nutzergruppe könnte davon besonders betroffen sein?";
    }
    if (phase === 'grundlagen') {
      return "Verstanden. Soll ich „Bedienbar“ in 3-5 Sätzen erklären und dann eine Verständnisfrage stellen?";
    }
    if (phase === 'leittext') {
      return "Gut. Aufgabe 2: Finde ein Beispiel für ein Bedienelement ohne sichtbares Label. Wie würdest du es verbessern?";
    }
    if (phase === 'praxis') {
      return "Hinweis: Teste die Tab-Reihenfolge. Springt der Fokus logisch von links nach rechts, oben nach unten?";
    }
    if (phase === 'projekt') {
      return "Dokumentiere kurz: Was ändert ihr, welches WCAG-Kriterium adressiert ihr, und wie messt ihr die Verbesserung?";
    }
    if (phase === 'reflexion') {
      return "Wenn du eine Sache morgen in deinem Team ändern könntest: Welche wäre das – und wie startest du?";
    }
    return "Danke! Magst du mir dein Ziel in einem Satz beschreiben?";
  }

  // Start
  initUI();
})();