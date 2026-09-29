# Ask Talon AI Demo Notes

## Current demo implementation

The Ask Talon chat screen calls the backend endpoint `POST /api/chat`.

For the demo, the backend can use a Hugging Face hosted model:

```env
AI_PROVIDER=huggingface
HF_TOKEN=replace-with-hugging-face-token
HF_MODEL=HuggingFaceH4/zephyr-7b-beta
HF_API_URL=https://router.huggingface.co/v1/chat/completions
```

The response behavior is controlled by:

```text
mainapp/backend/ai_prompt.md
```

Edit that Markdown file to change how Talon AI should respond. Keep it operational, concise, and careful: it should not claim that live government systems, biometric databases, or verification sessions were checked unless those results are actually provided to the model.

## PPT demo explanation

**Private RAG and Agentic AI:** TALON is designed to support a private Sarvam 105B reasoning layer, subject to the selected deployment licence and infrastructure approval, that accepts natural human prompts such as "show recent sessions for this document ID" or "summarize why this case was flagged." The assistant would retrieve authorized verification records, correlate OCR fields, MRZ checks, biometric similarity, CSII relationship signals, officer actions, and Geopol movement patterns, then return an evidence-backed answer with citations to the underlying session artifacts.

For the demo, the chat interaction can be shown through a hosted Hugging Face model so the workflow can be demonstrated quickly. In the proposed production architecture, this hosted dependency is replaced by an approved private Sarvam deployment and local retrieval services running inside the secure deployment boundary.

## How the production Sarvam RAG layer works

1. **Ingest:** Verification sessions, OCR fields, MRZ results, face-comparison scores, CSII graph observations, Geopol checkpoint metadata, and officer decisions are written into controlled storage.
2. **Index:** Non-secret text evidence and metadata are embedded and indexed locally. Sensitive fields remain masked, encrypted, or tokenized according to role and retention policy.
3. **Retrieve:** When an officer asks a question, the system searches only the records that the officer is authorized to access.
4. **Correlate:** An agentic layer can plan multi-step queries, compare sessions across checkpoints, inspect risk signals, and assemble a traceable answer.
5. **Answer:** Sarvam 105B generates a short operational response with evidence references, uncertainty, and recommended next steps.
6. **Audit:** The prompt, retrieved record IDs, model response, and user action are logged for supervisory review.

## Why this is safe for national-security deployment

- **Private deployment option:** The production model and retrieval index should run without public internet exposure when the chosen Sarvam deployment path supports it.
- **Sovereign compute boundary:** The approved private deployment keeps prompts, evidence, and generated answers within the authority-controlled environment.
- **No direct decision authority:** The assistant provides evidence-backed support; the authorized officer remains responsible for final action.
- **Role-based retrieval:** Users can only ask across data they are permitted to see.
- **Evidence citations:** Answers should reference the sessions, fields, and signals used, reducing unsupported hallucination.
- **Retention controls:** Biometric and document media can follow fixed deletion windows, while audit metadata remains available for accountability.
- **Configurable fallback:** The demo can use Hugging Face for presentation, while production can switch to `AI_PROVIDER=sarvam` after the local stack is approved.

## Short slide wording

**Private RAG and Agentic AI**  
Sarvam 105B reasoning layer for natural-language investigation across authorized TALON records. It retrieves verification sessions, correlates OCR, MRZ, face, CSII, and Geopol signals, and returns evidence-backed answers with audit logs while keeping sensitive data inside the approved deployment boundary.
