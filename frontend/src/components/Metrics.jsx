import React from 'react';

export default function Metrics({ data }) {
  if (!data) return null;

  return (
    <div style={{ background: '#252526', padding: '15px', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0, borderBottom: '1px solid #444', paddingBottom: '10px' }}>Bloch Vectors</h3>
      
      {data.bloch_vectors.map((vector, index) => {
        const [x, y, z] = vector;
        // Calculate vector length to see if it's a pure state (1.0) or mixed/entangled (< 1.0)
        const length = Math.sqrt(x*x + y*y + z*z).toFixed(3);
        
        return (
          <div key={index} style={{ marginBottom: '10px', fontSize: '14px' }}>
            <strong>Qubit {index}</strong>
            <div style={{ color: '#aaa', fontFamily: 'monospace', marginTop: '4px' }}>
              X: {x.toFixed(3)} <br/>
              Y: {y.toFixed(3)} <br/>
              Z: {z.toFixed(3)} <br/>
              <em>Vector Length: {length}</em>
            </div>
          </div>
        )
      })}
    </div>
  );
}