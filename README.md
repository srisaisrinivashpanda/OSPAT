# Hospitality — Holistic Optimization System for Policy-Integrated Admission & Treatment Intelligence

[![Java](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B-blue.svg)](https://www.postgresql.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%20API-blue.svg)](https://ai.google.dev/)

**Hospitality** is an enterprise-grade healthcare decision-support and admission intelligence platform designed to empower patients and caregivers during hospital admission. It eliminates financial confusion by extracting health insurance policy constraints, mathematically matching policy limits against hospital room categories, and providing stage-by-stage guidance throughout the care journey.

---

## 🌟 Key Features

1. **AI & PDF Document Intake Pipeline**:
   - Multi-page insurance schedule parsing using **Apache PDFBox 3**.
   - Structured JSON schema normalization using **Google Gemini API** (with configurable `GEMINI_MODEL`, e.g., `gemini-2.5-flash`), optional local **Ollama**, and zero-dependency **deterministic heuristic fallback**.
   - User-editable extracted parameters (Sum Insured, Daily Room Rent Limit, Room Category, Network Hospitals, Exclusions).
2. **Deterministic Hospital Matching Engine**:
   - Transparent multi-factor scoring: **Network Status (40%)**, **Room Rent Cap (30%)**, **Specialty Availability (20%)**, and **Policy Rules (10%)**.
   - Generates an explainable **Policy Compatibility Score** (e.g. *92% Match*) with transparent sub-scores, positive factors, and potential considerations.
   - LLMs explain results but **never** decide or override hospital scores.
3. **Room Category Compatibility Matrix**:
   - Evaluates every room category per hospital against stated policy caps.
   - Categorizes rooms into `WITHIN_STATED_LIMIT`, `POLICY_CONSIDERATION`, or `EXCEEDS_STATED_LIMIT` with explicit proportionate deduction warnings.
4. **4-Stage Care Journey State Machine**:
   - Roadmap across `ADMISSION` $\rightarrow$ `INVESTIGATION` $\rightarrow$ `PROCEDURE` $\rightarrow$ `RECOVERY`.
   - Stage-specific insurance insights, non-medical consumable warnings, document checklists, and interactive **Questions for the Hospital TPA Desk**.
5. **Strict Safety & Clinical Boundaries**:
   - Explicitly designed as a **decision-support platform**. Never provides clinical diagnoses, medical advice, or binding reimbursement guarantees.

---

## 🏗️ Architecture & AI Subsystem

```
com.hospitality
├── ai/              # DelegatingAIService (@Primary), GeminiAIService, OllamaAIService, HeuristicAIService, HeuristicPolicyExtractor
├── config/          # CORS, OpenApi, Hikari config
├── controller/      # REST API Controllers (/api/policies, /api/hospitals, /api/journeys, /api/dashboard, /api/ai, /api/samples)
├── dto/             # Request & Response Data Transfer Objects
├── entity/          # JPA Entities (Policy, Hospital, RoomCategory, CareJourney, etc.)
├── exception/       # Centralized GlobalExceptionHandler
├── hospital/        # Hospital querying & matching orchestration
├── journey/         # Care journey state engine & stage guidance
├── matching/        # Deterministic HospitalMatchingEngine
├── policy/          # Apache PDFBox extraction & policy confirmation
├── repository/      # Spring Data JPA Repositories
└── sample/          # Synthetic PDF Generator for testing
```

### Multi-Provider AI Architecture

```text
                    Controllers / Services
              (PolicyService, HospitalService, AIController)
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │   «interface»         │
                     │    AIService          │
                     └───────────────────────┘
                                 ▲
                                 │
                     ┌───────────────────────┐
                     │  DelegatingAIService  │  (@Primary)
                     │  (Provider Selection  │
                     │   & Heuristic Failover│
                     └───────────────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          ▼                      ▼                      ▼
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ GeminiAIService  │   │ OllamaAIService  │   │HeuristicAIService│
│ (Cloud REST API) │   │ (Local Dev Only) │   └────────┬─────────┘
└─────────┬────────┘   └────────┬─────────┘            │
          │                     │                      │
          │ (on failure/timeout)│ (on failure/refusal) │
          └───────────┬─────────┴──────────────────────┤
                      ▼                                ▼
            ┌──────────────────────────────────────────────┐
            │           HeuristicPolicyExtractor           │
            │       (Authoritative Deterministic Engine)   │
            └──────────────────────────────────────────────┘
```

---

## 🚀 AI Provider Configuration & Operating Modes

Hospitality supports three flexible operating modes via environment variables:

### Option A — Google Gemini API (Recommended for Cloud Deployment)
Ideal for free-tier/low-resource cloud hosting (Render, Railway, Fly.io, AWS) without requiring a local GPU or LLM daemon.

```bash
export AI_PROVIDER=gemini
export GEMINI_API_KEY="your-gemini-api-key"
export GEMINI_MODEL="gemini-2.5-flash"  # Configurable Gemini Flash model
```

> **Note:** If `GEMINI_API_KEY` is not provided or Gemini encounters a timeout/rate limit, the system automatically falls back to deterministic heuristic mode with zero startup or runtime errors.

### Option B — Local Ollama (Local Development)
For local development with self-hosted models:

```bash
export AI_PROVIDER=ollama
export OLLAMA_BASE_URL="http://localhost:11434"
export OLLAMA_MODEL="qwen2.5:7b"
```

### Option C — Zero-AI Heuristic Mode (Offline & CI Testing)
For completely offline, zero-dependency execution:

```bash
export AI_PROVIDER=heuristic
```

---

## ⚙️ Environment Variables Reference

| Variable | Default | Description |
| :--- | :--- | :--- |
| `AI_PROVIDER` | `gemini` | Active AI provider (`gemini`, `ollama`, or `heuristic`) |
| `GEMINI_API_KEY` | *(empty)* | Google Gemini API key (never hardcoded, never sent to client) |
| `GEMINI_MODEL` | `gemini-2.5-flash` | Configurable Gemini model identifier |
| `GEMINI_BASE_URL` | `https://generativelanguage.googleapis.com` | Google Generative Language API endpoint |
| `GEMINI_CONNECT_TIMEOUT_MS` | `5000` | HTTP connect timeout in milliseconds |
| `GEMINI_READ_TIMEOUT_MS` | `20000` | HTTP read timeout in milliseconds |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama local endpoint |
| `OLLAMA_MODEL` | `qwen2.5:7b` | Ollama model identifier |
| `DATABASE_URL` | `jdbc:postgresql://localhost:5432/hospitality_db` | PostgreSQL / Supabase JDBC connection URL |
| `DATABASE_USERNAME` | `postgres` | Database username |
| `DATABASE_PASSWORD` | `pass` | Database password |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:3001` | Whitelisted CORS frontend origins |
| `DB_POOL_MAX_SIZE` | `10` | Maximum HikariCP connection pool size |
| `DB_POOL_MIN_IDLE` | `2` | Minimum idle pool connections |

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Java 21 LTS**
- **Maven 3.9+**
- **PostgreSQL 16+** or **Docker Desktop**

### 1. Database Setup (Docker)
```bash
docker compose up -d
```
*Creates `hospitality_db` on port `5432` with username `postgres` and password `pass`.*

### 2. Run Backend (Spring Boot 3)
```bash
cd backend
mvn spring-boot:run
```
*The backend starts at `http://localhost:8080` and automatically runs Flyway migrations `V1__initial_schema.sql`, `V2__seed_data.sql`, and `V3__curated_public_hospitals.sql`.*

---

## ☁️ Hosted Deployment (Supabase PostgreSQL)

Hospitality is 100% cloud-ready with **Supabase PostgreSQL**. For full step-by-step instructions on setting up Supabase, obtaining JDBC connection strings, configuring cloud environment variables, and connecting Next.js, see:

📖 **[Supabase PostgreSQL Deployment Guide](DEPLOYMENT_SUPABASE.md)**

---

## 🧪 Running Automated Tests

```bash
# Run complete backend test suite (Gemini API, Multi-Provider Routing, Matching Engine, Room Matrix, Care Journey)
cd backend
mvn test
```

---

## 📖 Documentation Links

- 🚀 [Supabase PostgreSQL Deployment Guide](DEPLOYMENT_SUPABASE.md)
- 🏛️ [System Architecture & Math Models](docs/architecture.md)
- 🔌 [REST API Specifications & Schemas](docs/api.md)
- 🎯 [3-Minute Hackathon Demo Script](docs/demo.md)
- 📜 [Swagger UI Live Docs](http://localhost:8080/swagger-ui.html)

---

## ⚖️ Safety & Regulatory Disclaimer

> **IMPORTANT:** Hospitality is strictly an informational decision-support tool. It does **not** diagnose medical conditions, recommend clinical therapies, or guarantee insurance reimbursement. All compatibility calculations are indicative based on user-provided policy data. Always verify cashless pre-authorization with the hospital TPA desk and your insurance provider.

