# Interview Prep Tool

A personal mock interview simulator for Michael and Thiago. Powered by Claude AI, runs entirely in the browser, hosted free on GitHub Pages.

---

## What it does

- Takes a job description + optional company URLs as context
- Simulates HR, Manager, or Panel interviews (15 / 30 / 60 min)
- AI speaks via browser text-to-speech; you answer via microphone
- Scores performance across 5 domains with detailed feedback
- Saves session history to GitHub; emails results via mailto

---

## One-time setup (do this once, ~20 minutes)

### Step 1 — Create the GitHub repo

1. Go to github.com → New repository
2. Name it `interview-prep` (or whatever you prefer)
3. Set it to **Public** (required for GitHub Pages)
4. Upload all files from this folder: `index.html`, `worker.js`, `data/michael.json`, `data/thiago.json`

### Step 2 — Enable GitHub Pages

1. In the repo → Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: `main` / folder: `/ (root)`
4. Save — your site will be live at `https://YOUR_USERNAME.github.io/interview-prep`

### Step 3 — Create a GitHub Personal Access Token (PAT)

This lets the tool save session results to the repo.

1. GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Click **Generate new token**
3. Name: `interview-prep-write`
4. Expiration: 1 year (or no expiration)
5. Repository access: **Only select repositories** → choose your interview-prep repo
6. Permissions → Contents: **Read and Write**
7. Generate and copy the token (you won't see it again)

### Step 4 — Set up the Cloudflare Worker

This keeps your Anthropic API key hidden from the browser.

1. Go to https://dash.cloudflare.com → sign up free if needed
2. Workers & Pages → Create Worker
3. Delete the default code, paste in the entire contents of `worker.js`
4. Update the `allowedOrigins` line with your actual GitHub Pages URL
5. Click **Save and Deploy**
6. Go to the worker → **Settings** → **Variables**
7. Under **Secret Variables** → Add variable:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your Anthropic API key (from console.anthropic.com)
8. Save. Copy your Worker URL — it looks like `https://something.yourname.workers.dev`

### Step 5 — Update `index.html` config

Open `index.html` and find the `CONFIG` block near the top of the `<script>` section:

```javascript
const CONFIG = {
  sitePassword:    "CHANGE_THIS_PASSWORD",   // ← pick a password
  workerUrl:       "https://YOUR_WORKER.YOUR_SUBDOMAIN.workers.dev",  // ← paste worker URL
  githubToken:     "YOUR_GITHUB_PAT",        // ← paste your PAT from Step 3
  githubOwner:     "YOUR_GITHUB_USERNAME",   // ← your GitHub username
  githubRepo:      "interview-prep",         // ← your repo name
};
```

Fill in all five values, save, and push to GitHub.

### Step 6 — Share with Michael

Send Michael the URL: `https://YOUR_USERNAME.github.io/interview-prep`
And the access code (whatever you set as `sitePassword`).

He bookmarks it, enters the code once, and it remembers him. Done.

---

## How to update

Any change to `index.html` pushed to the `main` branch goes live within ~60 seconds.

---

## File structure

```
interview-prep/
├── index.html          ← the entire app (one file)
├── worker.js           ← Cloudflare proxy (deployed separately)
├── data/
│   ├── michael.json    ← Michael's session history
│   └── thiago.json     ← Thiago's session history
└── README.md           ← this file
```

---

## Cost estimate

| Component | Cost |
|-----------|------|
| GitHub Pages hosting | Free |
| Cloudflare Worker | Free (100k req/day) |
| Browser speech (TTS + mic) | Free |
| Session history storage | Free (GitHub file) |
| Email (mailto) | Free |
| Claude API (Haiku) | ~$0.01–0.05 per session |
| **50 sessions/month** | **~$0.50–1.50/month** |

You pay only for Claude API usage, billed to your Anthropic account.

---

## Browser compatibility

- **Chrome / Edge**: Full support (best voice quality, best mic recognition)
- **Safari**: Works but voice selection is limited
- **Firefox**: Speech recognition not supported — mic button won't work

Recommend Chrome for the best experience.

---

## Troubleshooting

**Mic not working**: Make sure the browser has microphone permission. In Chrome: click the lock icon in the address bar → Microphone → Allow.

**AI not speaking**: Check your device volume. Some browsers require a user gesture before audio plays — clicking the mic button counts.

**Session not saving**: Check that `githubToken`, `githubOwner`, and `githubRepo` in CONFIG are correct. The token needs Read+Write on repo contents.

**CORS error in console**: Make sure the `allowedOrigins` in `worker.js` includes your exact GitHub Pages URL (no trailing slash).
