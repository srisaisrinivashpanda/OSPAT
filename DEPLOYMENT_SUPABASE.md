# 🚀 Hospitality (OSPAT) — Supabase PostgreSQL Deployment Guide

This document provides step-by-step instructions for deploying the **Hospitality (OSPAT)** Spring Boot backend with a hosted **Supabase PostgreSQL** database, while preserving local development workflows and architecture integrity.

---

## 🏛️ Target Architecture

```text
┌─────────────────────────┐
│     Next.js Frontend    │ (Vercel / Node.js)
└───────────┬─────────────┘
            │  REST API calls (NEXT_PUBLIC_API_URL)
            ▼
┌─────────────────────────┐         ┌─────────────────────────┐
│ Spring Boot 3 (OSPAT)   ├────────►│  Google Gemini Flash API│ (Server-Side Only)
└───────────┬─────────────┘         └─────────────────────────┘
            │  JDBC Connection (Flyway Migrations V1, V2, V3)
            ▼
┌─────────────────────────┐
│   Supabase PostgreSQL   │ (Hosted Database / PgBouncer / Session Pooler)
└─────────────────────────┘
```

> [!IMPORTANT]
> - **Zero Frontend Database Exposure**: The Next.js frontend **never** connects directly to Supabase and holds no database credentials or service keys. Spring Boot is the sole authoritative backend.
> - **Automated Schema & Seeding**: Flyway manages all migrations (`V1__initial_schema.sql`, `V2__seed_data.sql`, `V3__curated_public_hospitals.sql`). On startup against an empty Supabase database, all tables, indexes, and 45 curated hospitals are provisioned automatically.

---

## 📋 Prerequisites

- A [Supabase](https://supabase.com) account.
- A cloud hosting environment for the Spring Boot backend (Render, Railway, Fly.io, AWS Elastic Beanstalk, Azure App Service, or Docker host).
- A cloud hosting environment for Next.js (Vercel, Netlify, Cloudflare Pages, or Docker host).
- A Google AI Studio API key for Gemini (`GEMINI_API_KEY`).

---

## 🛠️ Step-by-Step Deployment Instructions

### Step 1: Create a Supabase Project
1. Log in to the [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **"New project"**.
3. Enter a Project Name (e.g. `hospitality-ospat-db`) and set a strong database password.
4. Select a region close to your backend hosting server.
5. Click **"Create new project"** and wait for provisioning to complete (~1-2 minutes).

---

### Step 2: Obtain Supabase PostgreSQL Connection Details
1. In your Supabase Dashboard, navigate to **Project Settings** $\rightarrow$ **Database**.
2. Scroll to the **Connection parameters** / **Connection string** section.
3. Choose the **JDBC** tab or construct the JDBC URL from the standard PostgreSQL connection details:

#### Direct Connection (Port 5432):
```text
jdbc:postgresql://db.<PROJECT-REF>.supabase.co:5432/postgres?sslmode=require
```

#### Session Mode Connection Pooler (Port 5432 or 6543):
```text
jdbc:postgresql://aws-0-<REGION>.pooler.supabase.com:5432/postgres?sslmode=require
```

*Note: Replace `<PROJECT-REF>` with your Supabase reference ID and ensure `sslmode=require` is appended.*

---

### Step 3: Configure Spring Boot Backend Environment Variables

Configure the following environment variables in your cloud hosting provider (e.g., Render, Railway, AWS):

| Environment Variable | Recommended Deployment Value | Purpose |
| :--- | :--- | :--- |
| `DATABASE_URL` | `jdbc:postgresql://db.<PROJECT-REF>.supabase.co:5432/postgres?sslmode=require` | Hosted PostgreSQL connection endpoint |
| `DATABASE_USERNAME` | `postgres` (or pooler username `postgres.<PROJECT-REF>`) | Database user |
| `DATABASE_PASSWORD` | `<YOUR-SUPABASE-DB-PASSWORD>` | Database password |
| `AI_PROVIDER` | `gemini` | AI extraction provider |
| `GEMINI_API_KEY` | `AIzaSy...` | Server-side Gemini API key |
| `GEMINI_MODEL` | `gemini-2.5-flash` | Gemini model name |
| `CORS_ALLOWED_ORIGINS` | `https://your-frontend.vercel.app,http://localhost:3000` | Whitelisted frontend origins |
| `DB_POOL_MAX_SIZE` | `10` | Maximum Hikari pool connections |
| `DB_POOL_MIN_IDLE` | `2` | Minimum idle connections |

> [!WARNING]
> Never commit database passwords or `GEMINI_API_KEY` to Git repositories or public source code.

---

### Step 4: Start the Spring Boot Backend

When your Spring Boot container or application starts up:
1. **Datasource Initialization**: HikariCP opens a connection to Supabase PostgreSQL using SSL.
2. **Flyway Migration Execution**:
   - `V1__initial_schema.sql`: Creates `users`, `patients`, `hospitals`, `hospital_specialties`, `room_categories`, `insurance_policies`, `policy_exclusions`, `network_hospitals`, `care_journeys`, `journey_events`, `policy_extractions`, and indexes.
   - `V2__seed_data.sql`: Seeds synthetic demo patients, initial benchmark hospitals (IDs 1–10), room categories, and sample policies.
   - `V3__curated_public_hospitals.sql`: Seeds 35 verified public hospitals from `hospital_directory.csv` (IDs 11–45) with specialties, room tiers, and insurer network tie-ups.
3. **Sequence Synchronization**: Primary key sequences (`hospitals_id_seq`, `room_categories_id_seq`, etc.) are automatically updated to prevent identifier collisions.
4. **JPA Validation**: Hibernate validates all entity mappings against the Flyway schema (`ddl-auto: validate`).

---

### Step 5: Verify the Backend REST API

Once deployed, test your public backend URL using `curl`:

```bash
# 1. Health check & hospital list (verifies database connectivity & 45 hospitals)
curl -X GET "https://your-backend.onrender.com/api/hospitals"

# 2. Check active insurance policy
curl -X GET "https://your-backend.onrender.com/api/policies/patient/1/active"

# 3. Test hospital matching engine
curl -X POST "https://your-backend.onrender.com/api/hospitals/match" \
     -H "Content-Type: application/json" \
     -d '{"patientId":1,"policyId":1,"requiredSpecialty":"Cardiology","preferredRoomCategory":"Semi-Private"}'

# 4. Check active care journey
curl -X GET "https://your-backend.onrender.com/api/journeys/1"
```

---

### Step 6: Connect Next.js Frontend to the Deployed Backend

In your Next.js project settings (e.g., on Vercel):

1. Add the environment variable:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   ```
2. Trigger a redeploy.
3. Open your deployed frontend URL (e.g. `https://hospitality-frontend.vercel.app`) and verify:
   - Dashboard displays patient data and policy metrics.
   - Hospital Discovery displays 45 hospitals across Bengaluru, Hyderabad, Mumbai, and Chennai.
   - Insurance policy upload and matching flows operate smoothly.

---

## 📊 Hospital Dataset Provenance & Data Audit

| Metric / Attribute | Value / Details |
| :--- | :--- |
| **Source Dataset** | Open Government Data (OGD) `hospital_directory.csv` |
| **Source Rows Inspected** | 30,273 records |
| **Duplicate Records Filtered** | 544 records |
| **Incomplete / Invalid Records Filtered** | 28,897 records |
| **Verified Public Records Selected** | 35 hospitals (IDs 11–45) |
| **Existing Benchmark IDs Preserved** | 10 hospitals (IDs 1–10) |
| **Total Final Hospitals in Database** | **45 hospitals** |
| **Cities Represented** | Bengaluru Urban, Hyderabad, Mumbai, Chennai |
| **Public-Source Fields Used** | `name`, `location`, `address`, `specialties`, `facilities` |
| **Simulated Indicative Fields** | Room categories, daily tariffs (INR 1,200 – 14,000), insurer network tie-ups |

> [!NOTE]
> **Simulated Indicative Demo Data Notice**: Room categories, room tariffs, and insurer network mappings are simulated indicative demo data designed for hospital-policy decision support prototyping. They do not constitute formal commercial contracts or binding hospital tariffs.

---

## 🔄 Local Development Fallback

Local development continues to work without changes:
```bash
# If DATABASE_URL is not set, Spring Boot falls back to local PostgreSQL:
# url: jdbc:postgresql://localhost:5432/hospitality_db
# username: postgres
# password: pass

cd backend
mvn spring-boot:run
```
