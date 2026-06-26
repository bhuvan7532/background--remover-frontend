# Faaya React Frontend

React (Vite) frontend for the Faaya Product Preprocessor API.

## Project Structure

```
faaya-react/       ← this folder (React frontend)
faaya-gemini/      ← existing Python backend (FastAPI)
```

---

## Quick Start

### 1 · Start the FastAPI backend

```bash
cd faaya-gemini
pip install -r requirements.txt
python main.py
# Runs on http://localhost:8000
```

Make sure your `.env` has:
```
GEMINI_API_KEY=your-key-here
```

### 2 · Start the React frontend

```bash
cd faaya-react
npm install
npm run dev
# Opens on http://localhost:3000
```

The Vite dev server **proxies** all `/process`, `/stats`, `/health`, and `/download` requests to the FastAPI backend at `http://localhost:8000` — no CORS issues.

---

## Build for production

```bash
npm run build
# Output in dist/
```

You can then serve `dist/` as static files from FastAPI:
```python
app.mount("/", StaticFiles(directory="dist", html=True), name="static")
```

---

## Tech Stack

| Layer     | Tech                              |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite 5                  |
| Styling   | Inline styles + CSS custom props  |
| Backend   | FastAPI, rembg, Pillow            |
| AI        | Google Gemini 1.5 Flash           |
