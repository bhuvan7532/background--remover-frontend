import { useRef, useState } from 'react'

const styles = {
  zone: {
    border: '2px dashed var(--border-strong)',
    borderRadius: 'var(--radius)',
    padding: '48px 32px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: 'var(--surface)',
    position: 'relative',
  },
  zoneDrag: {
    borderColor: 'var(--accent)',
    background: 'var(--accent-pale)',
    transform: 'scale(1.01)',
  },
  icon: {
    fontSize: '40px',
    marginBottom: '14px',
    display: 'block',
    lineHeight: 1,
  },
  label: {
    fontWeight: '600',
    fontSize: '15px',
    color: 'var(--ink)',
    marginBottom: '6px',
  },
  sub: {
    fontSize: '13px',
    color: 'var(--ink-muted)',
  },
  preview: {
    marginTop: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '12px',
    background: 'var(--canvas)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
  },
  previewImg: {
    width: '56px',
    height: '56px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid var(--border)',
  },
  previewName: {
    fontWeight: '500',
    fontSize: '14px',
    color: 'var(--ink)',
    wordBreak: 'break-all',
  },
  previewSize: {
    fontSize: '12px',
    color: 'var(--ink-muted)',
    marginTop: '2px',
  },
  clearBtn: {
    marginLeft: 'auto',
    background: 'none',
    border: 'none',
    fontSize: '18px',
    color: 'var(--ink-muted)',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background 0.15s',
  },
}

export default function UploadZone({ onFileSelect, selectedFile, onClear }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file)
    }
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) onFileSelect(file)
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div>
      <div
        style={{ ...styles.zone, ...(dragging ? styles.zoneDrag : {}) }}
        onClick={() => !selectedFile && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <span style={styles.icon}>🧥</span>
        <div style={styles.label}>
          {dragging ? 'Drop it here' : 'Click to upload or drag & drop'}
        </div>
        <div style={styles.sub}>JPG, PNG, WebP, GIF · Max 10 MB</div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleChange}
        />
      </div>

      {selectedFile && (
        <div style={styles.preview}>
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="preview"
            style={styles.previewImg}
          />
          <div>
            <div style={styles.previewName}>{selectedFile.name}</div>
            <div style={styles.previewSize}>{formatSize(selectedFile.size)}</div>
          </div>
          <button
            style={styles.clearBtn}
            onClick={(e) => { e.stopPropagation(); onClear() }}
            title="Remove file"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
