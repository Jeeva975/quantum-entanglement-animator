import numpy as np
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector, partial_trace
from qiskit.quantum_info.operators import Pauli

def get_bloch_coordinates(density_matrix):
    """
    Calculates the (x, y, z) Bloch sphere coordinates from a single-qubit density matrix.
    Using the formulas: x = Tr(rho * X), y = Tr(rho * Y), z = Tr(rho * Z)
    """
    x = np.real(density_matrix.expectation_value(Pauli('X')))
    y = np.real(density_matrix.expectation_value(Pauli('Y')))
    z = np.real(density_matrix.expectation_value(Pauli('Z')))
    return [x, y, z]

def simulate_quantum_system(num_qubits: int, operations: list):
    """
    Builds a circuit, applies gates, and returns statevectors and Bloch coordinates.
    `operations` format example: [{'gate': 'h', 'target': 0}, {'gate': 'cx', 'control': 0, 'target': 1}]
    """
    qc = QuantumCircuit(num_qubits)
    
    # 1. Apply operations requested by the frontend
    for op in operations:
        gate = op.get("gate").lower()
        if gate == "h":
            qc.h(op.get("target"))
        elif gate == "x":
            qc.x(op.get("target"))
        elif gate == "cx" or gate == "cnot":
            qc.cx(op.get("control"), op.get("target"))
            
    # 2. Get the full multi-qubit statevector
    state = Statevector.from_instruction(qc)
    
    # 3. Calculate the Bloch vector for each individual qubit
    bloch_vectors = []
    for i in range(num_qubits):
        # Create a list of all qubits EXCEPT the current one (i)
        other_qubits = [q for q in range(num_qubits) if q != i]
        
        # 'Trace out' the other qubits to look at qubit 'i' in isolation
        if other_qubits:
            rho_i = partial_trace(state, other_qubits)
        else:
            from qiskit.quantum_info import DensityMatrix
            rho_i = DensityMatrix(state)
            
        coords = get_bloch_coordinates(rho_i)
        bloch_vectors.append(coords)
        
    # Convert full statevector to a list of complex numbers (real, imag) for the frontend
    state_data = [{"real": np.real(amp), "imag": np.imag(amp)} for amp in state.data]
    
    return {
        "num_qubits": num_qubits,
        "bloch_vectors": bloch_vectors,  # Array of [x, y, z] for each sphere
        "state_vector": state_data       # Full joint state for entanglement visualization
    }