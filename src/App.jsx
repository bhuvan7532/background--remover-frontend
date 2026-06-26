import { useState, useCallback, useEffect } from 'react'
import UploadZone from './components/UploadZone'
import MetadataPanel from './components/MetadataPanel'
import StatsBar from './components/StatsBar'

const API_BASE = '' // vite proxy handles /process, /stats

const styles = {
  root: {
    minHeight: '100vh',
    background: 'var(--canvas)',
    padding: '0 20px 60px',
  },

  /* ── Header ── */
  header: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '48px 0 36px',
    borderBottom: '1px solid var(--border)',
    marginBottom: '40px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
  },
  wordmark: {
    fontFamily: 'var(--font-display)',
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--ink)',
    letterSpacing: '-0.02em',
    lineHeight: 1,
  },
  wordmarkAccent: {
    color: 'var(--accent)',
  },
  tagline: {
    fontSize: '14px',
    color: 'var(--ink-muted)',
    marginTop: '6px',
    maxWidth: '380px',
    lineHeight: 1.5,
  },
  healthDot: (ok) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: ok ? 'var(--success)' : 'var(--ink-muted)',
    fontWeight: '500',
  }),
  dot: (ok) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: ok ? 'var(--success)' : '#bbb',
    animation: ok ? 'none' : 'pulse 1.5s infinite',
  }),

  /* ── Layout ── */
  main: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    alignItems: 'start',
  },

  /* ── Left panel ── */
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '24px',
  },
  cardTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '18px',
    color: 'var(--ink)',
    marginBottom: '18px',
  },

  /* ── Buttons ── */
  btnGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '16px',
  },
  btnProcess: {
    flex: 1,
    padding: '13px 20px',
    background: 'var(--accent)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.15s, transform 0.1s',
    letterSpacing: '-0.01em',
  },
  btnReset: {
    padding: '13px 16px',
    background: 'var(--canvas)',
    color: 'var(--ink)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },

  /* ── Loader ── */
  loader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 0 8px',
    gap: '12px',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid var(--border)',
    borderTop: '3px solid var(--accent)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loaderText: {
    fontSize: '14px',
    color: 'var(--ink-muted)',
    textAlign: 'center',
    lineHeight: 1.6,
  },

  /* ── Alerts ── */
  error: {
    padding: '12px 14px',
    background: 'var(--accent-pale)',
    color: 'var(--accent)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '13px',
    borderLeft: '3px solid var(--accent)',
    marginTop: '12px',
  },

  /* ── Stats ── */
  statsWrap: {
    marginTop: '28px',
  },

  /* ── Pipeline steps ── */
  steps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 0',
    borderBottom: '1px solid var(--border)',
  },
  stepLast: {
    borderBottom: 'none',
  },
  stepNum: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'var(--accent)',
    color: 'white',
    fontSize: '11px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepText: {
    fontSize: '13px',
    color: 'var(--ink-muted)',
  },

  /* ── Empty state (right panel) ── */
  emptyRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '280px',
    background: 'var(--surface)',
    border: '1px dashed var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--ink-faint)',
    fontSize: '14px',
    textAlign: 'center',
    padding: '40px',
    gap: '10px',
  },

  /* ── Footer ── */
  footer: {
    maxWidth: '1100px',
    margin: '48px auto 0',
    paddingTop: '24px',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  footerText: {
    fontSize: '13px',
    color: 'var(--ink-faint)',
  },
  techStack: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  tech: {
    padding: '3px 10px',
    background: 'var(--canvas)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-full)',
    fontSize: '11px',
    color: 'var(--ink-muted)',
    fontWeight: '500',
  },
}

const PIPELINE_STEPS = [
  'Background removed with rembg',
  'Standardised to 800 × 800 PNG',
  'Dominant colour extracted',
  'AI metadata generated via Gemini',
]

export default function App() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)
  const [copied, setCopied] = useState(false)
  const [backendOk, setBackendOk] = useState(null)

  /* Health check */
  useEffect(() => {
    fetch('/health')
      .then(r => r.ok ? setBackendOk(true) : setBackendOk(false))
      .catch(() => setBackendOk(false))
  }, [])

  /* Load stats */
  const loadStats = useCallback(async () => {
    try {
      const r = await fetch('/stats')
      const d = await r.json()
      setStats(d)
    } catch (_) {}
  }, [])

  useEffect(() => { loadStats() }, [loadStats])

  const handleFileSelect = (f) => {
    if (f.size > 10 * 1024 * 1024) {
      setError('File exceeds 10 MB limit.')
      return
    }
    setFile(f)
    setError(null)
    setResult(null)
  }

  const handleClear = () => {
    setFile(null)
    setResult(null)
    setError(null)
  }

  const handleProcess = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const form = new FormData()
      form.append('file', file)
      const r = await fetch('/process', { method: 'POST', body: form })
      const data = await r.json()
      if (data.success) {
        setResult(data)
        loadStats()
      } else {
        setError(data.error || 'Processing failed. Check the backend logs.')
      }
    } catch (e) {
      setError('Could not reach the backend.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!result?.metadata) return
    navigator.clipboard.writeText(JSON.stringify(result.metadata, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={styles.root}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <div style={styles.wordmark}>
            Faaya<span style={styles.wordmarkAccent}>.</span>
          </div>
          <div style={styles.tagline}>
            Smart background removal 
          </div>
        </div>
        <div style={styles.healthDot(backendOk)}>
          <div style={styles.dot(backendOk)} />
          {backendOk === null ? 'Checking backend…' : backendOk ? 'Backend online' : 'Backend offline'}
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.grid}>
          {/* ── Left: Upload + controls ── */}
          <div style={styles.leftPanel}>
            <div style={styles.card}>
              <div style={styles.cardTitle}>Upload  Image</div>
              <UploadZone
                selectedFile={file}
                onFileSelect={handleFileSelect}
                onClear={handleClear}
              />
              <div style={styles.btnGroup}>
                <button
                  style={{
                    ...styles.btnProcess,
                    opacity: (!file || loading) ? 0.45 : 1,
                    cursor: (!file || loading) ? 'not-allowed' : 'pointer',
                  }}
                  onClick={handleProcess}
                  disabled={!file || loading}
                >
                  {loading ? 'Processing…' : '⚡ Process Image'}
                </button>
                <button style={styles.btnReset} onClick={handleClear}>
                  Reset
                </button>
              </div>

              {loading && (
                <div style={styles.loader}>
                  <div style={styles.spinner} />
                  <div style={styles.loaderText}>
                    Removing background · Standardising · Generating metadata
                    <br />
                    <span style={{ fontSize: '12px', opacity: 0.7 }}>
                      This can take 10–30 seconds
                    </span>
                  </div>
                </div>
              )}

              {error && <div style={styles.error}>⚠ {error}</div>}
            </div>

            {/* Pipeline explainer */}
            <div style={styles.card}>
              <div style={{ ...styles.cardTitle, fontSize: '14px', marginBottom: '12px' }}>
                Processing Pipeline
              </div>
              <div style={styles.steps}>
                {PIPELINE_STEPS.map((s, i) => (
                  <div
                    key={i}
                    style={{ ...styles.step, ...(i === PIPELINE_STEPS.length - 1 ? styles.stepLast : {}) }}
                  >
                    <div style={styles.stepNum}>{i + 1}</div>
                    <div style={styles.stepText}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Results ── */}
          <div>
            {result ? (
              <MetadataPanel result={result} onCopy={handleCopy} copied={copied} />
            ) : (
              <div style={styles.emptyRight}>
                <span style={{ fontSize: '36px' }}>🪡</span>
                <span>Results appear here after processing</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div style={styles.statsWrap}>
            <StatsBar stats={stats} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <span style={styles.footerText}>smart background remover 🚀</span>
        <div style={styles.techStack}>
          {['React', 'Vite', 'FastAPI', 'rembg', 'Gemini Vision', 'Pillow'].map(t => (
            <span key={t} style={styles.tech}>{t}</span>
          ))}
        </div>
      </footer>
    </div>
  )
}
