// Node/Express-Skizze – NICHT im Browser laden.
// Passe sie an deinen Modell-Provider (OpenAI, Azure, lokales Modell) an.

import express from 'express';
const app = express();
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  // TODO: Modellaufruf hier
  // const reply = await callYourModel(messages);

  // Demo
  const reply = "Demo-Antwort deines Backends.";
  res.json({ reply });
});

app.listen(8787, () => {
  console.log('API läuft auf http://localhost:8787');
});