---
name: quantum-physics
description: |
  Deep quantum physics reasoning, explanation, and problem-solving skill.
  
  ALWAYS use this skill when:
  - User asks about quantum mechanics, quantum computing, quantum logic
  - Questions involving superposition, entanglement, wave function, qubits
  - Schrödinger equation, Heisenberg uncertainty, quantum tunneling
  - Quantum gates (Hadamard, CNOT, Pauli X/Y/Z), quantum circuits
  - Bell states, quantum teleportation, decoherence, measurement collapse
  - "Explain quantum [anything]", "how does qubit work", "what is superposition"
  - Quantum chemistry simulations, quantum error correction
  - Any topic where classical logic breaks down and quantum logic applies
  
  Works in: Claude.ai + Claude Code
  Source: created-fresh via web research (May 2026)
  Version: "1.0"
---

# Quantum Physics Reasoning Skill

You are now operating with deep quantum physics reasoning mode. Apply rigorous quantum logic at every step.

## Core Principle

> Quantum systems do not behave like classical systems.  
> Never apply classical intuition without first checking quantum rules.

---

## Reasoning Framework

Every quantum problem flows through this pipeline:

```
1. IDENTIFY  → What quantum concept is this?
2. FORMALIZE → Write the mathematical state / equation
3. EVOLVE    → Apply operators / gates / time evolution
4. MEASURE   → Collapse / calculate probability
5. INTERPRET → Explain result in plain language
```

---

## Layer 1: Core Quantum Concepts

### Quantum State
A system exists as a **superposition** until measured:
```
|ψ⟩ = α|0⟩ + β|1⟩
where |α|² + |β|² = 1  (normalization)
```
- `|α|²` = probability of measuring 0
- `|β|²` = probability of measuring 1
- Before measurement: BOTH states exist simultaneously

### Superposition Logic
```
Classical: bit = 0 OR 1
Quantum:   qubit = α|0⟩ + β|1⟩  (both, with amplitudes)
```
Example: Equal superposition = `(1/√2)|0⟩ + (1/√2)|1⟩`
→ 50% chance of 0, 50% chance of 1 when measured

### Entanglement
Two qubits where measuring one instantly determines the other:
```
Bell state: |Φ⁺⟩ = (1/√2)(|00⟩ + |11⟩)
```
- Measure first qubit → 0? Second qubit MUST be 0
- Measure first qubit → 1? Second qubit MUST be 1
- This holds regardless of distance (non-local correlation)

### Wave Function & Collapse
- Before measurement: wave function `|ψ⟩` describes all possibilities
- Upon measurement: wave function **collapses** to one definite state
- Collapse is irreversible and probabilistic

### Heisenberg Uncertainty Principle
```
ΔxΔp ≥ ℏ/2
```
- Cannot simultaneously know exact position AND momentum
- More precisely you know position → less precisely you can know momentum
- Not a measurement limitation — a fundamental property of nature

### Quantum Tunneling
A particle can pass through a barrier it classically couldn't:
```
Transmission probability T ≈ e^(-2κL)
κ = √(2m(V₀-E))/ℏ
```
- Used in: tunnel diodes, nuclear fusion in stars, scanning tunneling microscopes

---

## Layer 2: Quantum Gates (Computing)

| Gate | Matrix | Effect |
|------|--------|--------|
| **Hadamard (H)** | `(1/√2)[[1,1],[1,-1]]` | Creates superposition from |0⟩ or |1⟩ |
| **Pauli-X** | `[[0,1],[1,0]]` | Quantum NOT — flips |0⟩↔|1⟩ |
| **Pauli-Z** | `[[1,0],[0,-1]]` | Phase flip on |1⟩ |
| **CNOT** | 4×4 matrix | Entangles two qubits (control + target) |
| **T Gate** | `[[1,0],[0,e^(iπ/4)]]` | π/8 phase rotation |

**Common circuit patterns:**
```
H gate → creates superposition
H + CNOT → creates Bell state (entanglement)
H + T + H → part of universal quantum computation
```

---

## Layer 3: Quantum Logic Rules

Apply these rules when reasoning about quantum systems:

### Rule 1 — No Cloning
```
Cannot copy an unknown quantum state.
|ψ⟩|0⟩ ≠ |ψ⟩|ψ⟩  (forbidden by no-cloning theorem)
```

### Rule 2 — Measurement Destroys Superposition
Once measured, the quantum state is gone. Can't "un-measure."

### Rule 3 — Interference
Quantum amplitudes can ADD (constructive) or CANCEL (destructive):
```
Constructive: α + β → higher probability
Destructive:  α - β → lower probability (can reach 0!)
```
Quantum algorithms exploit this to amplify correct answers.

### Rule 4 — Entanglement ≠ Communication
Entangled qubits are correlated but cannot send information faster than light.
(Measurement outcomes are random — no control over which result you get.)

### Rule 5 — Unitary Evolution
All quantum operations (except measurement) are **reversible** and **unitary**:
```
U†U = I  (unitary condition)
```
Every quantum gate has an inverse.

---

## Layer 4: Problem-Solving Workflow

### For Conceptual Questions
1. Identify the quantum phenomenon being asked about
2. Contrast with classical equivalent (where it breaks down)
3. Give mathematical state if helpful
4. Use analogy only if it doesn't mislead
5. State what the analogy gets wrong

### For Calculation Problems
```
Step 1: Write initial quantum state |ψ₀⟩
Step 2: Apply each gate/operator in sequence
Step 3: Compute resulting state |ψ_final⟩
Step 4: Calculate measurement probabilities |coefficient|²
Step 5: Interpret physical meaning
```

### For "Is this possible?" Questions
Check against fundamental limits:
- No-cloning theorem
- No-communication theorem  
- Heisenberg uncertainty
- Second law (entropy)
- CPT symmetry

---

## Layer 5: Key Domains

| Domain | Core Concept | Real Application |
|--------|-------------|-----------------|
| Quantum Computing | Qubits + gates | Shor's algorithm (factoring), Grover's search |
| Quantum Cryptography | Entanglement + no-cloning | Unhackable key distribution (QKD) |
| Quantum Chemistry | Molecular orbital simulation | Drug discovery, materials science |
| Quantum Sensing | Superposition sensitivity | Atomic clocks, MRI, gravitational waves |
| Quantum Error Correction | Logical qubits | Fault-tolerant quantum computers |

---

## Layer 6: Common Misconceptions — Correct These Always

| Wrong belief | Correct quantum logic |
|-------------|----------------------|
| "Superposition means 50/50" | No — amplitudes can be any values summing to 1 |
| "Observation means a person looking" | Any physical interaction collapses the state |
| "Entanglement allows FTL communication" | No — outcomes are random, no information transfer |
| "Quantum computers are faster at everything" | Only for specific problems (factoring, search, simulation) |
| "Schrödinger's cat is alive AND dead" | It's in a superposition — the analogy is imperfect |
| "Quantum tunneling is random" | It's probabilistic but governed by exact equations |

---

## Output Format

When answering quantum physics questions:

1. **State the concept** — one clear sentence
2. **Give the math** — even simplified, always include notation
3. **Walk through logic** — step by step, no classical shortcuts
4. **Real-world anchor** — at least one application or experimental example
5. **Flag counterintuitive parts** — warn where human intuition fails

---

## Auto-Improve Triggers (for skill-manager)

After each use, skill-manager rates this skill 1–10.
Patch triggers:
- Score < 7: add missing concept to correct layer
- User confusion about notation: add clearer example to that section
- Wrong answer caught: add correction + note to misconceptions table
- New quantum computing development (2025+): web_search and update Layer 4/5

## Changelog
- v1.0 (2026-05-25): Created fresh via skill-manager web research mode
