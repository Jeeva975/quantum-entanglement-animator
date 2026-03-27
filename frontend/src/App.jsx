import { useState, useEffect } from 'react'
import axios from 'axios'
import Visualizer3D from './components/Visualizer3D'
import Controls from './components/Controls'
import Metrics from './components/Metrics'

function App() {
  const [numQubits, setNumQubits] = useState(2);
  const [operations, setOperations] = useState([]);
  const [simData, setSimData] = useState(null);

  const runSimulation = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/simulate', {
        num_qubits: numQubits,
        operations: operations
      });
      setSimData(response.data);
    } catch (error) {
      console.error("Simulation failed:", error);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [numQubits, operations]);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      {/* Left Side: 3D Visualization */}
      <div style={{ flex: 1, position: 'relative' }}>
        {simData ? <Visualizer3D data={simData} /> : <p style={{padding: '20px'}}>Loading Physics Engine...</p>}
      </div>

      {/* Right Side: Dynamic Control Panel */}
      <div style={{ width: '350px', padding: '20px', background: '#1e1e1e', borderLeft: '1px solid #333', overflowY: 'auto' }}>
        <h2 style={{ marginTop: 0 }}>Quantum Lab</h2>
        
        {/* Number of Qubits Toggle */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginRight: '10px' }}>Qubits:</label>
          <select 
            value={numQubits} 
            onChange={(e) => {
              setNumQubits(parseInt(e.target.value));
              setOperations([]); // Reset circuit if qubit count changes
            }}
            style={{ padding: '5px' }}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>

        {/* Dynamic Controls Component */}
        <Controls 
          numQubits={numQubits} 
          operations={operations} 
          setOperations={setOperations} 
        />
        
        {/* Reset Button */}
        <button 
          style={{ padding: '10px', background: '#f44336', color: 'white', border: 'none', cursor: 'pointer', width: '100%', borderRadius: '4px', marginBottom: '20px' }}
          onClick={() => setOperations([])}>
          Clear Circuit
        </button>

        {/* Math Data Component */}
        <Metrics data={simData} />

      </div>
    </div>
  )
}

export default App