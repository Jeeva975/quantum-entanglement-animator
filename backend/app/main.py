from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector, partial_trace
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Operation(BaseModel):
    gate: str
    target: int
    control: Optional[int] = None

class CircuitRequest(BaseModel):
    num_qubits: int
    operations: List[Operation]

@app.post("/api/simulate")
def simulate_circuit(req: CircuitRequest):
    qc = QuantumCircuit(req.num_qubits)
    
    for op in req.operations:
        if op.gate == 'x':
            qc.x(op.target)
        elif op.gate == 'y':
            qc.y(op.target)
        elif op.gate == 'z':
            qc.z(op.target)
        elif op.gate == 'h':
            qc.h(op.target)
        elif op.gate == 'cx':
            if op.control is not None:
                qc.cx(op.control, op.target)
                
    state = Statevector.from_instruction(qc)
    
    # 1. Calculate the Individual Qubit Vectors (What you had before)
    bloch_vectors = []
    for i in range(req.num_qubits):
        others = [j for j in range(req.num_qubits) if j != i]
        rho_i = partial_trace(state, others)
        
        X = np.array([[0, 1], [1, 0]])
        Y = np.array([[0, -1j], [1j, 0]])
        Z = np.array([[1, 0], [0, -1]])
        
        x_val = np.real(np.trace(rho_i.data @ X))
        y_val = np.real(np.trace(rho_i.data @ Y))
        z_val = np.real(np.trace(rho_i.data @ Z))
        
        bloch_vectors.append([float(x_val), float(y_val), float(z_val)])

    # 2. NEW: Calculate the Probabilities for Entanglement!
    prob_dict = state.probabilities_dict()
    probabilities = []
    for state_str, prob in prob_dict.items():
        if prob > 0.001: # Only track outcomes that actually have a chance of happening
            # Qiskit reads right-to-left. We reverse it so Qubit 0 is on the left.
            reversed_state = state_str[::-1]
            probabilities.append({
                "state": reversed_state,
                "probability": float(prob)
            })

    return {
        "num_qubits": req.num_qubits,
        "bloch_vectors": bloch_vectors,
        "probabilities": probabilities # We send this back to React!
    }