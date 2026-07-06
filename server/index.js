import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'data');
const stateFile = path.join(dataDir, 'state.json');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const defaultState = {
  darkMode: false,
  library: [],
  sources: [],
  clips: [],
  trainingExamples: [],
  categories: [],
};

async function ensureStateFile() {
  await mkdir(dataDir, { recursive: true });
  try {
    await readFile(stateFile, 'utf8');
  } catch {
    await writeFile(stateFile, JSON.stringify(defaultState, null, 2), 'utf8');
  }
}

async function readState() {
  await ensureStateFile();
  const raw = await readFile(stateFile, 'utf8');
  return JSON.parse(raw);
}

async function writeState(state) {
  await ensureStateFile();
  await writeFile(stateFile, JSON.stringify(state, null, 2), 'utf8');
}

app.get('/api/state', async (_req, res) => {
  try {
    const state = await readState();
    res.json(state);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/state', async (req, res) => {
  try {
    const nextState = {
      ...defaultState,
      ...req.body,
    };
    await writeState(nextState);
    res.json(nextState);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`HearMe server listening on http://127.0.0.1:${port}`);
});
