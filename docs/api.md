# Hospitality — REST API Documentation

Base URL: `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui.html`
OpenAPI JSON: `http://localhost:8080/api-docs`

---

## 1. Insurance Policy Endpoints

### Upload & Extract PDF
- **Endpoint**: `POST /api/policies/upload`
- **Content-Type**: `multipart/form-data`
- **Parameters**: `file` (MultipartFile), `patientId` (Long, optional, default: 1)
- **Response**: `200 OK`
```json
{
  "policyId": 1,
  "insurerName": "Star Health Allied Insurance",
  "policyType": "Family Health Optima Comprehensive",
  "coverageLimit": 500000.00,
  "roomLimit": 5000.00,
  "roomCategory": "Semi-Private Room (Twin Sharing)",
  "networkHospitals": ["Apex Multi-Specialty Hospital", "Metro Care Medical Institute"],
  "exclusions": ["Cosmetic treatments excluded.", "36-month pre-existing disease waiting period."],
  "otherConstraints": ["Cashless pre-auth required 48h prior."],
  "confidence": 0.95
}
```

### Confirm & Activate Policy
- **Endpoint**: `PUT /api/policies/{id}/confirm`
- **Content-Type**: `application/json`
- **Request Body**:
```json
{
  "insurerName": "Star Health Allied Insurance",
  "policyType": "Family Health Optima Comprehensive",
  "coverageLimit": 500000.00,
  "remainingCoverage": 500000.00,
  "roomLimit": 5000.00,
  "roomCategory": "Semi-Private Room (Twin Sharing)",
  "confirmed": true,
  "exclusions": ["Cosmetic treatments excluded."]
}
```

### Get Active Policy
- **Endpoint**: `GET /api/policies/patient/{patientId}/active`
- **Response**: `200 OK` (`PolicyResponseDto`)

---

## 2. Hospital & Matching Endpoints

### Get All Hospitals
- **Endpoint**: `GET /api/hospitals`
- **Response**: `200 OK` (List of hospitals with specialties and room categories)

### Match Policy Against Hospitals
- **Endpoint**: `POST /api/hospitals/match`
- **Content-Type**: `application/json`
- **Request Body**:
```json
{
  "policyId": 1,
  "patientId": 1,
  "specialty": "Cardiology",
  "location": "Bengaluru"
}
```
- **Response**: `200 OK` (List of `HospitalMatchResultDto` sorted by compatibility score with sub-scores)

### Get Hospital Details
- **Endpoint**: `GET /api/hospitals/{id}`
- **Response**: `200 OK` (Hospital details, specialties, and room categories)

---

## 3. Care Journey Endpoints

### Start / Select Care Journey
- **Endpoint**: `POST /api/journeys?patientId={patientId}&hospitalId={hospitalId}`
- **Response**: `200 OK` (`CareJourneyDto`)

### Update Care Stage
- **Endpoint**: `PUT /api/journeys/{id}/stage`
- **Content-Type**: `application/json`
- **Request Body**:
```json
{
  "stage": "INVESTIGATION",
  "note": "Doctor ordered diagnostic MRI and lab workup"
}
```

### Get Stage Context & Insurance Guidance
- **Endpoint**: `GET /api/journeys/{id}/context`
- **Response**: `200 OK` (Current stage insights, constraints, caregiver questions for TPA desk, required documents)

---

## 4. Dashboard, AI Explanation & Samples Endpoints

### Get Dashboard Summary
- **Endpoint**: `GET /api/dashboard/{patientId}`
- **Response**: `200 OK` (Aggregated metrics, indicative balance, active policy, active journey, alerts)

### Generate AI Explanation
- **Endpoint**: `POST /api/ai/explain`
- **Content-Type**: `application/json`
- **Request Body**: `{"hospitalId": 1, "policyId": 1}`
- **Response**: `200 OK` (`AIExplainResponseDto`)

### Download Sample PDF
- **Endpoint**: `GET /api/samples/pdf/{type}` (`star`, `hdfc`, or `care`)
- **Response**: `200 OK` (`application/pdf`)
