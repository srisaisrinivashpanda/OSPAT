# Hospitality — 3-Minute Hackathon Demo Script

Follow this step-by-step walkthrough to evaluate the complete end-to-end user journey:

---

## Step 1: Open Executive Dashboard
1. Open `http://localhost:3000/dashboard` in your browser.
2. Observe the **Active Patient Context** (`Rajesh Verma, 58y`) in the top right.
3. Review the **4 Core Metric Cards**:
   - Indicative Coverage gauge (₹4,75,000 / ₹5,00,000 Sum Insured)
   - Daily Room Rent Cap (₹5,000 / day — Semi-Private)
   - Network Hospitals Count (8 / 10 Listed)
   - Care Journey Stage tracker (`ADMISSION`)
4. Note the clear **Decision-Support Safety Disclaimers** across the interface.

---

## Step 2: Upload & Extract Insurance Policy
1. Click **"Insurance Policy"** in the top navigation or **"Upload New Policy"** on the dashboard.
2. In the **Quick Test Samples** panel on the right, click **"Star Health Optima (₹5L)"** (or upload your own PDF).
3. Observe the animated 4-step extraction pipeline (`1. PDFBox Text Parser` $\rightarrow$ `2. Ollama AI Engine` $\rightarrow$ `3. Rule Normalization` $\rightarrow$ `4. Structured Schema`).
4. Review the extracted fields:
   - Insurer Name: `Star Health Allied Insurance`
   - Sum Insured: `₹5,00,000`
   - Daily Room Rent Limit: `₹5,000 / day`
   - Room Category: `Semi-Private (Twin Sharing)`
   - Network Hospitals: 8 tagged facilities
   - Exclusions: 4 extracted clauses
5. Click **"Confirm & Set Active Policy"**.
6. A green confirmation banner will appear confirming activation.

---

## Step 3: Explore Hospital Policy Compatibility
1. Click **"Explore Compatible Hospitals"** or navigate to **"Hospital Matching"** (`/hospitals`).
2. Observe the top matched hospitals:
   - **Apex Multi-Specialty Hospital**: `100% Match (HIGH COMPATIBILITY)`
     - *✓ Listed network hospital*
     - *✓ Compatible room categories starting from ₹1,800/day within stated cap of ₹5,000/day*
   - Compare with out-of-network facilities (e.g. *Aster CMI Healthcare*): displays `OUT_OF_NETWORK` warning with reimbursement advisory.
3. Use the **Specialty Filter** (e.g., click `Cardiology` or `Orthopedics`) to filter clinical departments.

---

## Step 4: Inspect Room Compatibility Matrix
1. On **Apex Multi-Specialty Hospital**, click **"Room Breakdown & Select"** (`/hospitals/1`).
2. Examine the **Room Category Compatibility Matrix**:
   - `General Sharing Ward (4-Bed)`: ₹1,800/day $\rightarrow$ `✓ Fully Covered` (₹3,200 headroom)
   - `Semi-Private (Twin Sharing)`: ₹3,800/day $\rightarrow$ `✓ Fully Covered` (₹1,200 headroom)
   - `Super Deluxe Suite`: ₹12,500/day $\rightarrow$ `✕ Exceeds Room Cap` (+₹7,500/day excess, *Proportionate deduction warning*)
3. Read the AI Caregiver explanation generated in simple, non-technical English.
4. Click **"Select Hospital & Start Care Journey"**.

---

## Step 5: Navigate 4-Stage Care Journey
1. On the Care Journey screen (`/journey/1`), observe the active facility (**Apex Multi-Specialty Hospital**).
2. Note the 4 roadmap stages: `1. Admission & Pre-Auth` $\rightarrow$ `2. Investigation & Labs` $\rightarrow$ `3. Procedure & Treatment` $\rightarrow$ `4. Recovery & Discharge`.
3. Check off items in the **"Questions for Hospital TPA & Billing Desk"** interactive checklist.
4. Type a note (e.g., *"Pre-auth sanctioned ₹45,000"*) and click **"Advance to Next Stage"** to move to `INVESTIGATION`.
5. Observe how the **Insurance Insights**, **Potential Constraints**, and **TPA Questions** dynamically update for the new clinical stage.
6. Scroll down to review the real-time **Care Journey Activity History Log**.
