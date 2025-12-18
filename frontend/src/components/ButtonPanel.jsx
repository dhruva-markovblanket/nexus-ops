import React from 'react'

export default function ButtonPanel({ items = [] }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {items.map((label) => (
        <button key={label} onClick={() => {}} style={{ padding: '8px 12px' }}>
          {label}
        </button>
      ))}
    </div>
  )
}
