import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const SUBJECTS_DIR = path.join(DATA_DIR, 'subjects');

// Initialize Data Directories
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR);
if (!existsSync(SUBJECTS_DIR)) mkdirSync(SUBJECTS_DIR);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Utility functions
const writeJson = async (filepath, data) => fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf8');
const readJson = async (filepath, fallback) => {
    try {
        const file = await fs.readFile(filepath, 'utf8');
        return JSON.parse(file);
    } catch (e) {
        return fallback;
    }
};

app.get('/api/sync', async (req, res) => {
    try {
        // Read System Config
        const prefs = await readJson(path.join(DATA_DIR, 'prefs.json'), { dailyHours: 4 });
        const examDate = await readJson(path.join(DATA_DIR, 'exam.json'), '2026-06-15');
        const history = await readJson(path.join(DATA_DIR, 'history.json'), []);

        // Aggregate independent subject files
        const subjectFiles = await fs.readdir(SUBJECTS_DIR).catch(() => []);
        const subjects = [];
        for (const file of subjectFiles) {
            if (file.endsWith('.json')) {
                const subData = await readJson(path.join(SUBJECTS_DIR, file), null);
                if (subData) subjects.push(subData);
            }
        }

        res.json({ subjects, history, prefs, examDate });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Sync failed' });
    }
});

// Update global payloads
app.post('/api/history', async (req, res) => {
    await writeJson(path.join(DATA_DIR, 'history.json'), req.body);
    res.json({ success: true });
});

app.post('/api/prefs', async (req, res) => {
    await writeJson(path.join(DATA_DIR, 'prefs.json'), req.body);
    res.json({ success: true });
});

app.post('/api/exam', async (req, res) => {
    await writeJson(path.join(DATA_DIR, 'exam.json'), req.body.examDate);
    res.json({ success: true });
});

// Write to individual physical Subject JSON Files
app.post('/api/subjects', async (req, res) => {
    // We expect the entire array for ease of state synchronization from React context
    // This will overwrite/create individual files based on Subject ID
    try {
        const subjects = req.body;
        for (const sub of subjects) {
            // sanitize file name (e.g. machine_learning_abc123.json)
            const safeName = sub.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const filePath = path.join(SUBJECTS_DIR, `${safeName}_${sub.id}.json`);
            await writeJson(filePath, sub);
        }
        
        // Also read directory and delete any files that no longer exist in the payload (in case of purge)
        const activeIds = subjects.map(s => s.id);
        const existingFiles = await fs.readdir(SUBJECTS_DIR).catch(() => []);
        for (const file of existingFiles) {
            if (file.endsWith('.json')) {
                const subData = await readJson(path.join(SUBJECTS_DIR, file), null);
                // IF file doesn't match ID, or subData couldn't be parsed
                if (subData && !activeIds.includes(subData.id)) {
                    await fs.unlink(path.join(SUBJECTS_DIR, file)); // delete removed subject file
                }
            }
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed writing subject files' });
    }
});

app.delete('/api/purge', async (req, res) => {
    try {
        const existingFiles = await fs.readdir(SUBJECTS_DIR).catch(() => []);
        for(const f of existingFiles) await fs.unlink(path.join(SUBJECTS_DIR, f)).catch(() => {});
        await fs.unlink(path.join(DATA_DIR, 'history.json')).catch(() => {});
        res.json({ success: true });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`[NeuroPlan Backend] Data Vault operating on physical file system at port ${PORT}`);
});
