const styles = {
  panel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    animation: 'fadeUp 0.4s ease',
  },
  section: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '20px',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '13px',
    color: 'var(--ink-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '12px',
  },
  imageWrap: {
    background: 'repeating-conic-gradient(#ddd 0% 25%, white 0% 50%) 0 0 / 16px 16px',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8px',
    border: '1px solid var(--border)',
  },
  outputImg: {
    maxWidth: '100%',
    maxHeight: '280px',
    objectFit: 'contain',
    display: 'block',
    borderRadius: '4px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '22px',
    fontWeight: '700',
    color: 'var(--ink)',
    lineHeight: 1.3,
    marginBottom: '4px',
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '3px 10px',
    borderRadius: 'var(--radius-full)',
    fontSize: '12px',
    fontWeight: '500',
    background: 'var(--canvas)',
    color: 'var(--ink)',
    border: '1px solid var(--border)',
    marginRight: '6px',
    marginTop: '6px',
  },
  pillAccent: {
    background: 'var(--accent-pale)',
    color: 'var(--accent)',
    border: '1px solid rgba(200,64,42,0.2)',
  },
  field: {
    marginBottom: '14px',
  },
  fieldLast: {
    marginBottom: '0',
  },
  label: {
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    color: 'var(--ink-faint)',
    marginBottom: '4px',
  },
  value: {
    fontSize: '14px',
    color: 'var(--ink)',
    lineHeight: 1.5,
  },
  colorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  swatch: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: '1px solid var(--border)',
    flexShrink: 0,
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0',
    marginTop: '2px',
  },
  tag: {
    display: 'inline-block',
    padding: '3px 10px',
    background: 'var(--accent)',
    color: 'white',
    borderRadius: 'var(--radius-full)',
    fontSize: '12px',
    fontWeight: '500',
    marginRight: '6px',
    marginTop: '6px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  btnDownload: {
    flex: 1,
    padding: '11px 16px',
    background: 'var(--success)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  btnCopy: {
    flex: 1,
    padding: '11px 16px',
    background: 'var(--canvas)',
    color: 'var(--ink)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  errorNote: {
    fontSize: '12px',
    color: 'var(--accent)',
    marginTop: '8px',
    padding: '8px 10px',
    background: 'var(--accent-pale)',
    borderRadius: '4px',
  },
}

export default function MetadataPanel({ result, onCopy, copied }) {
  if (!result) return null

  const { metadata, image_base64, filename } = result
  const colorHex = metadata.dominant_color?.hex || '#808080'
  const colorRgb = metadata.dominant_color?.rgb || [128, 128, 128]

  return (
    <div style={styles.panel}>
      {/* Processed image */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Processed Image — 800 × 800 PNG</div>
        <div style={styles.imageWrap}>
          <img
            src={`data:image/png;base64,${image_base64}`}
            alt="processed garment"
            style={styles.outputImg}
          />
        </div>
      </div>

      {/* Title + quick pills */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Product Identity</div>
        <div style={styles.title}>{metadata.title}</div>
        <div>
          <span style={{ ...styles.pill, ...styles.pillAccent }}>
            {metadata.category}
          </span>
          <span style={styles.pill}>{metadata.style}</span>
        </div>
      </div>

      {/* Metadata fields */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>AI-Generated Metadata</div>

        <div style={styles.field}>
          <div style={styles.label}>Dominant Colour</div>
          <div style={styles.colorRow}>
            <div style={{ ...styles.swatch, backgroundColor: colorHex }} />
            <span style={styles.value}>
              {colorHex.toUpperCase()} · RGB({colorRgb.join(', ')})
            </span>
          </div>
        </div>

        <div style={styles.field}>
          <div style={styles.label}>Alt Text (SEO)</div>
          <div style={styles.value}>{metadata.alt_text}</div>
        </div>

        <div style={styles.fieldLast}>
          <div style={styles.label}>Tags</div>
          <div style={styles.tags}>
            {(metadata.tags || []).map((tag, i) => (
              <span key={i} style={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>

        {metadata.error && (
          <div style={styles.errorNote}>⚠️ {metadata.error}</div>
        )}
      </div>

      {/* Export */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Export</div>
        <div style={styles.actions}>
          <a
            href={`data:image/png;base64,${image_base64}`}
            download={filename}
            style={styles.btnDownload}
          >
            ⬇ Download PNG
          </a>
          <button style={styles.btnCopy} onClick={onCopy}>
            {copied ? '✓ Copied!' : '📋 Copy JSON'}
          </button>
        </div>
      </div>
    </div>
  )
}
