const styles = {
  bar: {
    display: 'flex',
    gap: '32px',
    padding: '18px 24px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    alignItems: 'center',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  value: {
    fontFamily: 'var(--font-display)',
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--accent)',
    lineHeight: 1,
  },
  label: {
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    color: 'var(--ink-faint)',
  },
  divider: {
    width: '1px',
    height: '36px',
    background: 'var(--border)',
  },
  files: {
    marginLeft: 'auto',
    fontSize: '12px',
    color: 'var(--ink-muted)',
  },
  fileList: {
    marginTop: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  fileItem: {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    color: 'var(--ink-faint)',
  },
}

export default function StatsBar({ stats }) {
  if (!stats) return null

  return (
    <div style={styles.bar}>
      <div style={styles.item}>
        <span style={styles.value}>{stats.total_processed}</span>
        <span style={styles.label}>Total Processed</span>
      </div>
      <div style={styles.divider} />
      <div style={styles.item}>
        <span style={styles.value}>{(stats.storage_used_mb || 0).toFixed(2)}</span>
        <span style={styles.label}>Storage MB</span>
      </div>
      {stats.latest_files?.length > 0 && (
        <>
          <div style={styles.divider} />
          <div style={{ ...styles.item, ...styles.files }}>
            <span style={styles.label}>Recent outputs</span>
            <div style={styles.fileList}>
              {stats.latest_files.slice(0, 3).map((f, i) => (
                <span key={i} style={styles.fileItem}>{f}</span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
