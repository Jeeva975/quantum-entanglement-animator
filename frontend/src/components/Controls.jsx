import React, { useState } from 'react';

export default function Controls({ numQubits, operations, setOperations }) {
  const [selectedGate, setSelectedGate] = useState('h');
  const [targetQubit, setTargetQubit] = useState(0);
  const [controlQubit, setControlQubit] = useState(1);

  const handleAddGate = () => {
    const newOp = { gate: selectedGate, target: parseInt(targetQubit) };
    if (selectedGate === 'cx') {
      newOp.control = parseInt(controlQubit);
    }
    setOperations([...operations, newOp]);
  };

  return (
    <div style={{ background: '#252526', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
      <h3 style={{ marginTop: 0, borderBottom: '1px solid #444', paddingBottom: '10px' }}>Circuit Builder</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
        <label>
          Gate:
          <select 
            value={selectedGate} 
            onChange={(e) => setSelectedGate(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px', width: '100%', marginTop: '5px' }}
          >
            <option value="x">X (Pauli-X / NOT)</option>
            <option value="y">Y (Pauli-Y)</option>
            <option value="z">Z (Pauli-Z)</option>
            <option value="h">H (Hadamard / Superposition)</option>
            <option value="cx">CX (C-NOT / Entangle)</option>
          </select>
        </label>

        {selectedGate === 'cx' && (
          <label>
            Control Qubit:
            <select 
              value={controlQubit} 
              onChange={(e) => setControlQubit(e.target.value)}
              style={{ marginLeft: '10px', padding: '5px', width: '100%', marginTop: '5px' }}
            >
              {[...Array(numQubits).keys()].map(i => (
                <option key={`ctrl-${i}`} value={i}>Qubit {i}</option>
              ))}
            </select>
          </label>
        )}

        <label>
          Target Qubit:
          <select 
            value={targetQubit} 
            onChange={(e) => setTargetQubit(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px', width: '100%', marginTop: '5px' }}
          >
            {[...Array(numQubits).keys()].map(i => (
              <option key={`target-${i}`} value={i}>Qubit {i}</option>
            ))}
          </select>
        </label>

        <button 
          onClick={handleAddGate}
          style={{ padding: '8px', background: '#007acc', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', marginTop: '10px' }}
        >
          Add Gate to Circuit
        </button>
      </div>

      <div style={{ background: '#1e1e1e', padding: '10px', borderRadius: '4px' }}>
        <h4>Current Circuit:</h4>
        {operations.length === 0 ? (
          <span style={{ color: '#888' }}>No gates applied yet.</span>
        ) : (
          <ol style={{ paddingLeft: '20px', margin: 0 }}>
            {operations.map((op, idx) => (
              <li key={idx} style={{ marginBottom: '5px' }}>
                <strong>{op.gate.toUpperCase()}</strong> on Q{op.target} 
                {op.gate === 'cx' && ` (Control: Q${op.control})`}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}