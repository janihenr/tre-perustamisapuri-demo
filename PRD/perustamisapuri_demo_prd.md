# Product Requirements Document (PRD) – Perustamisapuri Demo

## 1. Objective
The goal of this project is to build a **UI-focused demo** of *Perustamisapuri*, a digital assistant supporting entrepreneurship in Tampere. The demo focuses on **Phase 1 MVP features**, showcasing core functionalities and user flows rather than a full production implementation.  

## 2. Scope
**Included (MVP demo):**
- User authentication mock (simulating Suomi.fi login)  
- Simple user profile creation (local database / JSON mock)  
- Chat interaction with Perustamisapuri using OpenAI API  
- Retrieval-Augmented Generation (RAG) demo with mock dataset (JSON/PDF)  
- UI prototype in Finnish (Next.js + Shadcn)  
- Export of chat summary to PDF  

**Excluded:**  
- Real Suomi.fi integration  
- Full Azure infrastructure  
- Multi-phase roadmap (Phase 2–3)  
- Production-level performance/scaling  

## 3. User Journey
1. **Login**: User clicks “Kirjaudu sisään Suomi.fi” (mock).  
2. **Onboarding**: User provides basic info (name, municipality, business idea).  
3. **Chat with Apuri**:  
   - User asks entrepreneurship-related questions (e.g., “Mitä lupia ravintolalle tarvitaan?”).  
   - Apuri answers based on mock knowledge base.  
   - Chat history is stored locally.  
4. **Business Idea Profile**:  
   - Apuri summarizes discussion into “Yrittäjäprofiili” (profile view).  
   - User can view, edit, or export summary (PDF).  

## 4. Functional Requirements
- **Authentication:** Simulated login screen (no real Suomi.fi integration).  
- **Chat:** OpenAI API (GPT-4o-mini) for conversational assistant.  
- **Knowledge base:** Local JSON/PDF sample data, parsed into embeddings.  
- **RAG:** Vector search (e.g., Pinecone mock / local embedding search).  
- **Profile:** Stores business idea info and chat summaries (local DB or SQLite).  
- **Export:** Profile and summaries exportable as PDF.  

## 5. Non-Functional Requirements
- **UI:** Responsive, accessible (WCAG 2.1), in Finnish, styled with Shadcn UI.  
- **Performance:** Demo-scale only, fast enough for live demo.  
- **Security:** No real user data stored; all demo data synthetic.  

## 6. Architecture Overview
- **Frontend:** Next.js + Shadcn UI (TypeScript).  
- **Backend:** Node.js + Express (simple API endpoints).  
- **LLM:** OpenAI API (GPT-4o-mini for speed).  
- **Data store:** SQLite or local JSON.  
- **Deployment:** Local demo environment (no Azure required).  

## 7. UI Prototype (in Finnish)
- **Login Page:** "Kirjaudu sisään Suomi.fi" (mock button).  
- **Chat Interface:** Chat bubble layout, voice-to-text optional placeholder.  
- **Profile Page:** “Yrittäjäprofiili” showing:  
  - Liikeidea  
  - Tausta ja osaaminen  
  - Keskusteluhistoria  
  - Dokumentit  
  - Export button (“Lataa PDF”)  

## 8. Future Extensions (Out of Scope in Demo)
- Real Suomi.fi authentication  
- Integration with validated knowledge base (Azure Storage + ML pipeline)  
- Document upload and structured parsing (Word, PDF)  
- Financial calculations (cash flow, profitability, financing)  
- Local IoT and scenario integrations  
