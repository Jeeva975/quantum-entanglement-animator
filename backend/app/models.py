from pydantic import BaseModel
from typing import List, Optional

# Defines a single quantum gate (e.g., an H gate on Qubit 0, or a C-NOT from 0 to 1)
class Operation(BaseModel):
    gate: str
    target: int
    control: Optional[int] = None

# Defines the full request payload sent from the React frontend
class SimulationRequest(BaseModel):
    num_qubits: int
    operations: List[Operation]