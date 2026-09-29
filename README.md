<div align="center">
  <img src="https://github.com/user-attachments/assets/080b07b8-3961-4e10-a05c-69262d7522ed" height="317" alt="image"  /> 
</div>

<div align="center">
  <h1>TALON</h1>
  <p><strong>Tampering and Anomaly Locator and Operational Net</strong></p>
</div>

<hr>

<div align="center">
  <a href="https://youtu.be/Hxg2021K0fc">
    <img src="https://img.shields.io/badge/Watch%20App%20Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="Watch App Demo with Timestaps " />
  </a>
  <a href="https://www.notion.so/REPLACE_WITH_TALON_MODULE_DOCUMENTATION">
    <img src="https://img.shields.io/badge/Module--Wise%20Documentation-000000?style=for-the-badge&logo=notion&logoColor=white" alt="Module-wise documentation" />
  </a>
  <br>
  <p><strong>Video timestamps are available in the YouTube description.</p>
</div>



## TABLE OF CONTENTS 
Key Innovation CSII 
Key innovation Geopol 
Key Innovation Sarvam Airtight Integration plan 
Models Performance 
Hash chain and blockchain 
Module 1 OCR
Module 2 Document validators and classifiers
Module 3 Tampering and Anomaly Detection
Module 4 Face verification module 
Module 5 Integrations with govt sources 


## Introduction
TALON is an AI-assisted identity and travel-document screening platform for border, airport, immigration, and high-risk checkpoint environments. It combines document classification, OCR extraction, MRZ validation, face comparison, evidence review, CSII relationship analysis, Geopol movement visualization, and a tamper-evident audit trail into one officer-facing workflow.

The system is designed as decision support. It does not replace an authorized officer, immigration database, passport authority, or legal verification process. TALON surfaces evidence, inconsistencies, confidence scores, and audit records so that a human reviewer can make faster and more consistent screening decisions.


## Applicaition Workflow 

<img width="1027" height="646" alt="Picture1" src="https://github.com/user-attachments/assets/aef80e5a-9e83-426e-8449-e9378d8b73c0" />


### Runtime Components

| Layer | Current implementation | Production direction |
|---|---|---|
| Frontend | React 18, Vite, MapLibre, React Flow, local session store | Authenticated officer console with central API state |
| Backend | FastAPI, OCR/document processing, Rekognition integration, chat endpoint | Containerized backend with controlled network and secrets |
| Classification | Aadhaar notebook/artifacts where available; passport runtime path uses HOG + scikit-learn RandomForest; passport research notebook uses Keras/TensorFlow CNN | Versioned model registry and repeatable training/evaluation jobs |
| OCR | Tesseract OCR with PDF rasterization support through Poppler | OCR worker with queueing, retry, and document-quality scoring |
| MRZ | Client-side MRZ parser for passport-style MRZ text | Backend MRZ worker with issuer rules and field contradiction checks |
| Face comparison | AWS Rekognition DetectFaces and CompareFaces | Rekognition or approved sovereign biometric service behind backend only |
| CSII | Synthetic demo graph layer | Authorized integrations with identity and travel-intelligence systems |
| Geopol | Synthetic checkpoint map and travel trail | Event-backed checkpoint heatmaps and individual movement timelines |
| Storage | Browser/local demo store and optional Azure Blob staging | S3/MinIO/NIC storage with encryption, object hashes, retention and legal hold |
| Database | Separate MySQL schema package under `database/` | MySQL/PostgreSQL system of record integrated into backend |
| Audit | Frontend hash-chained audit events for demo | Backend append-only hash-chained audit ledger with external anchoring |

## Model and Evaluation Status

TALON should report only metrics that are actually produced by the project notebooks or repeatable evaluation runs. The tables below separate confirmed notebook output from metrics that still need a clean exported evaluation run.

### Passport Classifier - Keras/TensorFlow Notebook Benchmark

Source: `models/Passport classfier/passport_classifier.ipynb`

<img width="1233" height="497" alt="image" src="https://github.com/user-attachments/assets/ac4f1be8-3366-4dc2-a98e-b5444c43a993" />


## Per-class results from the notebook:
<img width="1197" height="122" alt="image" src="https://github.com/user-attachments/assets/871e15b3-622e-413b-9520-456ae3dfaa5c" />


## Training trace:

<img width="1195" height="442" alt="image" src="https://github.com/user-attachments/assets/b7b698b2-db61-44d0-b713-7e4d738636d8" />

### Aadhaar Classifier - Notebook and Runtime Status

Source: `models/Aadhar Classifier/Aadhar.ipynb`

The Aadhaar notebook contains model-development code for Logistic Regression, tuned SVM, tuned RandomForest, PCA, and soft-voting ensemble. The notebook text states that optimization improved the score from roughly 79-80% to about 83%, but the persisted output cells do not currently include the final precision, recall, F1-score, confusion matrix, or ROC-AUC values.

For a formal submission, this section should be regenerated from a clean evaluation run before claiming final Aadhaar metrics.

| Model candidate | Current evidence | README status |
|---|---|---|
| Logistic Regression + PCA | Notebook code and score variable | Re-run required for exact accuracy |
| Tuned SVM + PCA | Notebook code with `classification_report` call | Re-run required for precision, recall, F1 |
| Tuned RandomForest + PCA | Notebook code with GridSearchCV | Re-run required for exact accuracy |
| Soft-voting ensemble | Notebook note says about 83% after optimization | Treat as development result until exported |
| Runtime fallback | OCR keywords when artifacts are unavailable | Conservative fallback, not a trained-score claim |

### OCR and MRZ Evaluation Plan

| Module | Metric to report | How to compute |
|---|---|---|
| OCR full text | Character error rate and word error rate | Compare OCR output against manually prepared transcripts |
| OCR fields | Field accuracy | Compare name, DOB, nationality, document number, expiry fields |
| MRZ detection | Detection recall | Count documents where an MRZ exists and parser finds it |
| MRZ validation | Check-digit pass rate | Verify MRZ check digits and parser issues |
| OCR-MRZ consistency | Contradiction rate | Compare visual fields against parsed MRZ fields |

### Face Verification Evaluation Plan

| Metric | Meaning |
|---|---|
| TAR | True accept rate for genuine document/person pairs |
| FAR | False accept rate for impostor pairs |
| FRR | False reject rate for genuine pairs |
| Threshold | Similarity score used for pass/review/fail routing |
| Provider availability | Percentage of sessions where face comparison returned a valid score |

### Sarvam 105B Reasoning Layer

Sarvam 105B is planned as the private reasoning layer for officer questions, session summaries, and evidence-backed explanation. It should not be described as the module that verifies documents or makes border decisions. TALON retrieves structured evidence first, then the model explains that evidence in plain language.

| Capability | TALON use |
|---|---|
| Long-context reasoning | Summarize multi-signal verification sessions and investigation trails |
| Structured responses | Return case summary, risk reasons, uncertainty, and recommended next steps |
| Local/private deployment target | Keep prompts and evidence inside an approved deployment boundary when supported by the selected Sarvam licence |
| Guarded retrieval | Backend retrieves only authorized case evidence before calling the model |
| Audit logging | Store prompt metadata, retrieved record IDs, model version, and response reference |

## Model benchmarks
<img width="997" height="663" alt="image" src="https://github.com/user-attachments/assets/e1b901c8-8b83-4a7a-9506-c5a69ac420a9" />


## Tamper-Evident Audit Ledger

TALON now implements a lightweight hash-chained audit ledger for local audit events. This is intentionally not described as a blockchain. It is a practical tamper-evident ledger:

```text
event_hash_n = SHA256(chain_index_n + payload_hash_n + previous_event_hash_n)
payload_hash_n = SHA256(canonical_event_payload_n)
previous_event_hash_n = event_hash_(n-1)
```

Every new audit event stores:

| Field | Purpose |
|---|---|
| `chainIndex` | Ordered position of the event in the local chain |
| `previousEventHash` | Hash of the previous event |
| `payloadHash` | Hash of the event content |
| `eventHash` | Final hash linking this event to the chain |

This gives TALON a defensible cybersecurity feature for audit integrity. If a past event is edited, deleted, or reordered, the later hashes no longer verify. In production this should move to the backend database, run under append-only permissions, and periodically anchor the terminal hash in a separate protected system.

## Data Model and Records

Core record groups:

| Record group | Examples |
|---|---|
| Session identity | Session ID, officer ID, checkpoint, created time, status |
| Document evidence | Document type, issuing country, file hash, preview reference |
| OCR/MRZ results | Extracted fields, MRZ lines, check-digit status, parser issues |
| Biometric evidence | Document portrait reference, live capture reference, similarity score |
| Forensic result | Detector status, anomaly type, region, confidence |
| Risk signals | Module score, severity, reason, supporting evidence |
| CSII signals | Synthetic demo graph now; authorized correlation records later |
| Geopol events | Checkpoint, event type, timestamp, travel path |
| Audit events | Actor, action, target, metadata, hash-chain fields |

## CSII and Geopol

CSII and Geopol are intelligence layers, not primary document classifiers.

CSII links session evidence into a graph: document references, opaque face evidence references, synthetic Aadhaar demo nodes, prior travel records, and anomaly edges. The current CSII module is synthetic and clearly marked as demo-only. In production it should connect only through authorized APIs and strict access control.

Geopol visualizes checkpoint activity across India. It supports heatmap-style checkpoint load analysis and person-specific travel trail playback for a selected record. The current map uses no-key OpenStreetMap tiles through MapLibre for local development.

## Sarvam Private Reasoning Architecture

The model does not receive database credentials, object-store credentials, or direct access to government systems. It receives a bounded evidence packet prepared by TALON. It explains why a case was flagged, what evidence supports the conclusion, and which items require officer review. It does not approve, reject, alter, or delete sessions.

## Deployment and Security Direction

For local development, TALON runs as a Vite frontend and FastAPI backend. For a serious pilot, the system should be deployed with isolated services, encrypted storage, backend-only secrets, and observability.

| Area | Recommended production approach |
|---|---|
| Frontend hosting | Static build behind HTTPS and authenticated access |
| Backend | Dockerized FastAPI service behind an internal load balancer |
| Object storage | AWS S3, self-hosted MinIO, or NIC MeghRaj-compatible storage with encryption and object hashing |
| Database | MySQL 8/PostgreSQL with encrypted sensitive fields and append-only audit writes |
| Secrets | AWS Secrets Manager, Parameter Store, or equivalent government-approved secret store |
| Face comparison | AWS Rekognition or approved biometric service called only from backend |
| Network | Private subnets, no public database, tight security groups, VPC endpoints where available |
| Monitoring | CloudWatch or Prometheus/Grafana for service health, latency, errors, and model availability |
| AWS activity audit | CloudTrail for AWS API activity |
| Application audit | TALON hash-chained audit ledger for officer actions and session events |
| Retention | Fixed retention periods, legal hold support, verified deletion jobs |

## Repository Structure

```text
mainapp/
  backend/      FastAPI service, OCR, model inference, Rekognition, CSII service
  frontend/     React/Vite officer interface, dashboard, upload flow, CSII, Geopol
  models/       Aadhaar and passport model notebooks
  database/     MySQL schema package and database design documentation
  docs/         Demo and architecture notes
```

## Local Development

Backend:

```powershell
cd backend
python main.py
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

The frontend expects:

```env
VITE_API_URL=http://localhost:8000
VITE_API_TOKEN=veriquickx-secret-token-change-in-production
```

The backend expects matching `API_TOKEN`, Poppler/Tesseract configuration for OCR, and optional AWS Rekognition credentials for face comparison.

## Current Limitations

| Area | Honest status |
|---|---|
| Government integrations | Planned only. UIDAI, passport authority, airport systems, NATGRID, and watchlists are not connected in this prototype. |
| CSII | Synthetic demo records only. No real Aadhaar, immigration, or intelligence system is queried. |
| Geopol | Demo checkpoint data and travel trails. Not connected to live passenger movement feeds. |
| Forensic tampering | UI and schema path exist, but a real detector is not connected to the active processing service yet. |
| Sarvam private deployment | Planned architecture. The final deployment model, licence, and isolation mode must be confirmed with the provider and authority. |
| Model metrics | Passport notebook metrics are available. Aadhaar metrics need a clean exported evaluation run before formal claims. |

## Demo Q&A Preparation

| Question | Strong answer |
|---|---|
| Is TALON making the final border decision? | No. TALON is officer decision support. It extracts evidence, highlights inconsistencies, and records decisions, but the authorized officer remains responsible. |
| Is CSII connected to real Aadhaar or NATGRID data? | Not in the prototype. The demo uses synthetic graph records. The architecture is ready for secure API integration only after legal and authority approval. |
| Is the audit ledger a blockchain? | No. It is a hash-chained audit ledger. It is cheaper, simpler, and honest: every event links to the previous event hash, making edits detectable. |
| Can AWS Rekognition return a face hash? | No. CompareFaces returns similarity and face bounding details, not a reusable biometric hash. TALON uses opaque evidence references instead of pretending to store face hashes. |
| What happens if one module fails? | TALON marks that module unavailable or not run. It does not silently count unavailable modules as pass. |
| Why use Sarvam 105B? | Sarvam 105B is positioned as a reasoning layer for Indian context and natural-language investigation. TALON uses it to explain authorized records, not to directly verify documents. |
| What is production-ready now? | The application demonstrates the workflow, dashboard, CSII/Geopol concepts, OCR/MRZ path, Rekognition integration path, and audit-chain concept. Full production requires backend database integration, real forensic model, deployment hardening, and authorized data-source integrations. |

## Project Identity

**Project:** TALON - Tampering and Anomaly Locator and Operational Net  
**Event:** Smart India Hackathon 2026  
**Problem Statement:** AI-Based Fake Identity and Document Screening System  
**Technology Bucket:** AI/ML, Cloud Computing, Cybersecurity, Graph Intelligence
