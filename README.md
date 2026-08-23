# Hospitality — Holistic Optimization System for Policy-Integrated Admission & Treatment Intelligence

[![Java](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B-blue.svg)](https://www.postgresql.org/)

**Hospitality** is an enterprise-grade healthcare decision-support and admission intelligence platform designed to empower patients and caregivers during hospital admission. It eliminates financial confusion by extracting health insurance policy constraints, mathematically matching policy limits against hospital room categories, and providing stage-by-stage guidance throughout the care journey.

---

## 🌟 Key Features

1. **AI & PDF Document Intake Pipeline**:
   - Multi-page insurance schedule parsing using **Apache PDFBox 3**.
   - Structured JSON schema normalization using **Ollama (Qwen 2.5 7B)** with deterministic regex/rule fallback.
   - User-editable extracted parameters (Sum Insured, Daily Room Rent Limit, Room Category, Network Hospitals, Exclusions).
2. **Deterministic Hospital Matching Engine**:
   - Transparent multi-factor scoring: **Network Status (40%)**, **Room Rent Cap (30%)**, **Specialty Availability (20%)**, and **Policy Rules (10%)**.
   - Generates an explainable **Policy Compatibility Score** (e.g. *92% Match*) with transparent sub-scores, positive factors, and potential considerations.
3. **Room Category Compatibility Matrix**:
   - Evaluates every room category per hospital against stated policy caps.
   - Categorizes rooms into `WITHIN_STATED_LIMIT`, `POLICY_CONSIDERATION`, or `EXCEEDS_STATED_LIMIT` with explicit proportionate deduction warnings.
4. **4-Stage Care Journey State Machine**:
   - Roadmap across `ADMISSION` $\rightarrow$ `INVESTIGATION` $\rightarrow$ `PROCEDURE` $\rightarrow$ `RECOVERY`.
   - Stage-specific insurance insights, non-medical consumable warnings, document checklists, and interactive **Questions for the Hospital TPA Desk**.
5. **Strict Safety & Clinical Boundaries**:
   - Explicitly designed as a **decision-support platform**. Never provides clinical diagnoses, medical advice, or binding reimbursement guarantees.

---

## 🏗️ Architecture

```
com.hospitality
├── ai/              # OllamaAIService & HeuristicPolicyExtractor
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
*The backend starts at `http://localhost:8080` and automatically runs Flyway migrations `V1__initial_schema.sql` and `V2__seed_data.sql`.*

---

## 🧪 Running Automated Tests

```bash
# Run backend test suite (Matching Engine, Room Eligibility, Policy Extraction, Stage Guidance)
cd backend
mvn test
```

---

## 📖 Complete Documentation Links

- 🏛️ [System Architecture & Math Models](docs/architecture.md)
- 🔌 [REST API Specifications & Schemas](docs/api.md)
- 🎯 [3-Minute Hackathon Demo Script](docs/demo.md)
- 📜 [Swagger UI Live Docs](http://localhost:8080/swagger-ui.html)

---

## ⚖️ Safety & Regulatory Disclaimer

> **IMPORTANT:** Hospitality is strictly an informational decision-support tool. It does **not** diagnose medical conditions, recommend clinical therapies, or guarantee insurance reimbursement. All compatibility calculations are indicative based on user-provided policy data. Always verify cashless pre-authorization with the hospital TPA desk and your insurance provider.
