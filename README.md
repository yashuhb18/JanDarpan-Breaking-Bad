# 🏛️ Breaking Bad — Citizen Governance, AI Forensic Audit & Welfare Discovery Engine

> **Empowering 1.4 Billion Citizens with Instant AI Scheme Eligibility, Real-Time Civic Infrastructure Photo Audits, Polygon Blockchain Ledgering, and Section 80 CPC High Court PIL Enforcement.**

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](LICENSE)
[![React](https://img.shields.io/badge/Frontend-React.js%20%7C%20TailwindCSS-blue)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-emerald)](https://www.mongodb.com/cloud/atlas)
[![Blockchain](https://img.shields.io/badge/Ledger-Polygon%20SHA--256-purple)](https://polygon.technology/)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-GLM--4%20Vision%20%7C%20Legal--BERT-orange)](https://github.com/THUDM/GLM-4)

---

## 🌟 Key Highlights & Hackathon Innovation

JanDarpan AI bridges the gap between citizens, welfare schemes, and public infrastructure accountability. By combining **GLM-4 Vision AI**, **Legal-BERT NLP**, **Polygon Blockchain Hashing**, and **Automated WhatsApp Statutory Notice Dispatching**, JanDarpan eliminates corruption, streamlines government scheme delivery, and automates pre-litigation legal enforcement.

---

## 🚀 Complete Feature Index (Every Feature Detailed)

### 1. 🎯 Welfare Scheme Discovery Engine (`/schemes`, `/scheme/:id`)
- **4,290+ Central & State Schemes Database**: Seeds and queries over 4,290 active schemes directly from MongoDB Atlas across all 28 States and Union Territories.
- **⚡ 10-Second AI Scheme Eligibility Calculator Modal**:
  - Accepts profile inputs: Age, Gender, State of Domicile, Annual Household Income, and Occupation.
  - Queries backend MongoDB Atlas filter engine (`/api/v2/schemes/get-filtered-schemes`) to return live matched schemes with zero dummy data.
  - Calculates dynamic match percentage (e.g. `98% MATCHED`) and estimated annual Direct Benefit Transfer (DBT) cash value (e.g. `₹34,750 / Year`).
  - Displays required verification document checklist (Aadhaar, Ration Card, Income Cert, Bank Passbook).
  - Includes a **`📄 DOWNLOAD PRE-FILLED GOVT APPLICATION (PDF)`** button to export pre-populated application forms.
- **🎙️ Native Multilingual Voice Explainer (Kannada, Tamil, Hindi, Telugu, English)**:
  - Speaks in-depth audio explanations of every scheme in **Kannada (`kn-IN`)**, **Tamil (`ta-IN`)**, **Hindi (`hi-IN`)**, **Telugu (`te-IN`)**, and **English (`en-IN`)**.
  - Powered by a custom backend Google Neural TTS Proxy (`GET /api/v1/voice/tts`) with automatic 140-character text chunking for crystal-clear, uninterrupted native speech.
  - Generates 100% dynamic scheme text pulling the exact scheme title, nodal ministry, state, and benefit summary per scheme.
- **📱 Instant WhatsApp Scheme Details Alert (`+91 8050614849`)**:
  - Dispatches official scheme specification summaries directly to WhatsApp targeting `+91 8050614849`.
  - Triggers real-time animated on-screen push notifications + pre-filled WhatsApp Web deep links (`https://api.whatsapp.com/send`).
- **🔖 Bookmark / Favorite Schemes**: Save schemes to personal citizen profile with instant localStorage and MongoDB synchronization.
- **📄 Download Official Scheme PDF Specification**: One-click HTML5 canvas export of scheme details.

---

### 2. 🚨 Civic Infrastructure Audit & Virtual Courtroom (`/report-issue`)
- **📸 Geo-Tagged Citizen Photo Proof Reporting**:
  - GPS Auto-Detection using browser geolocation and Nominatim reverse-geocoding API for city and coordinate tagging.
  - Cloudinary photo proof upload integration with local DataURL fallback.
- **🧠 GLM-4 AI Vision Forensic Audit**:
  - Compares citizen ground-truth photo proof against contractor budget claims.
  - Detects physical work discrepancies (e.g., `34% Work Mismatch`) and triggers automatic statutory fund freezes.
- **⚖️ Instant Section 80 CPC High Court PIL Generator**:
  - Invokes Legal-BERT NLP engine to draft a ready-to-file High Court Public Interest Litigation (PIL) legal docket in under 300ms.
  - Generates legal citations under Section 80 CPC, Article 21 of the Indian Constitution, and IPC Section 409 (Criminal Breach of Trust).
- **📱 Automated WhatsApp Statutory Legal Notice Dispatcher**:
  - Sends official Section 80 CPC Show-Cause e-Notices directly to PWD Chief Engineers (`+91 8050614849`).
  - Initiates a 7-day statutory response countdown timer on the report docket.
- **⛓️ Polygon Blockchain SHA-256 Ledger Hashing**:
  - Generates immutable SHA-256 cryptographic hashes for every report, AI audit verdict, and notice.
  - Displays on-chain ledger verification badges (`BlockchainBadge.js`).
- **👍 Public Crowd-Verification Upvoting**: Citizens can upvote community reports to elevate legal escalation priority.

---

### 3. 🗺️ Interactive 3D Infrastructure Project Map (`/project-map`)
- **Interactive Geo-Fenced Map**: Renders public works projects across Indian cities using Leaflet / OpenStreetMap.
- **Real-Time Project Status Badges**: Filters projects by status: *Under Construction*, *Milestone Claimed*, *Audit Passed*, or *Statutory Fund Freeze*.

---

### 4. 🏢 Contractor Accountability Portal (`/contractor-portal`, `/leaderboard`)
- **Contractor Milestone Claims Dashboard**: Contractors submit milestone completion claims for official GLM-4 AI verification.
- **Honesty Rating & Public Leaderboard**: Ranks contractors based on physical work accuracy and audit pass rates.

---

### 5. 🛡️ 2FA Officer Dashboard (`/gov-dashboard`)
- **Officer Login & 2FA Verification**: Secure portal for government engineers and audit officers.
- **Statutory Action Console**: Review GLM-4 audit verdicts, approve budget disbursements, or issue show-cause notices.

---

### 6. 🌐 Global Multilingual & Accessibility System
- **Language Switcher**: Instant full-page UI translation for English, Hindi, Kannada, Tamil, Telugu, and Marathi (`LanguageContext.js`).
- **JanDarpan AI Voice Assistant**: Floating voice assistant component.
- **Interactive Demo Mode**: One-click preset demo scenario runner (`DemoMode.js`) for hackathon presentations.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React.js (v18), TailwindCSS, Lucide React Icons, React Hot Toast, React Router v6 |
| **Backend** | Node.js, Express.js, Axios, HTTPS Google Neural TTS Proxy |
| **Database** | MongoDB Atlas (Mongoose ORM with `mongoose-paginate-v2`) |
| **AI / NLP** | GLM-4 Vision AI, Legal-BERT Legal Document Generator |
| **Blockchain** | Polygon Testnet SHA-256 Public Ledger Hashing |
| **Messaging** | Meta / WhatsApp Web API, Backend WhatsApp Dispatcher Service |

---

## ⚡ Quick Start Guide (Commands to Run)

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Connection URL (configured in `Backend/.env`)
- (Optional) Ollama with `glm4` model loaded

---

### 1️⃣ Start Ollama AI Server (Optional for local LLM)
```powershell
ollama serve
```

---

### 2️⃣ Start Backend Server (Port 5000)
```powershell
cd Backend
node index.js
```
*Output: `MongoDB Atlas Connected Successfully... Server running on port 5000`*

---

### 3️⃣ Start Frontend Web Portal (Port 3000)
```powershell
cd Frontend
npm start
```
*Access the platform at **`http://localhost:3000`***

---

## 📜 Environment Variables Configuration

### `Backend/.env`
```env
PORT=5000
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net
ACCESS_TOKEN_SECRET=your_jwt_access_secret_key
REFRESH_TOKEN_SECRET=your_jwt_refresh_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### `Frontend/.env`
```env
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=666459438303-7g1qpjuv12m3q9c0pj8np1ugcuaj31cl.apps.googleusercontent.com
```

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---
*Built with ❤️ for 1.4 Billion Citizens by Team Breaking Bad.*
