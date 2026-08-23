-- V1__initial_schema.sql
-- Hospitality Schema Migration

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE patients (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hospitals (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    address TEXT,
    network_status VARCHAR(100) DEFAULT 'IN_NETWORK',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hospital_specialties (
    id BIGSERIAL PRIMARY KEY,
    hospital_id BIGINT NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    specialty VARCHAR(255) NOT NULL
);

CREATE TABLE room_categories (
    id BIGSERIAL PRIMARY KEY,
    hospital_id BIGINT NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    daily_cost NUMERIC(12, 2) NOT NULL,
    available BOOLEAN DEFAULT TRUE
);

CREATE TABLE insurance_policies (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    insurer_name VARCHAR(255),
    policy_type VARCHAR(255),
    coverage_limit NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    remaining_coverage NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    room_limit NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    room_category VARCHAR(255),
    policy_status VARCHAR(100) DEFAULT 'DRAFT',
    source_document VARCHAR(255),
    confirmed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE policy_exclusions (
    id BIGSERIAL PRIMARY KEY,
    policy_id BIGINT NOT NULL REFERENCES insurance_policies(id) ON DELETE CASCADE,
    description TEXT NOT NULL
);

CREATE TABLE network_hospitals (
    id BIGSERIAL PRIMARY KEY,
    policy_id BIGINT NOT NULL REFERENCES insurance_policies(id) ON DELETE CASCADE,
    hospital_id BIGINT NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    CONSTRAINT uq_policy_hospital UNIQUE (policy_id, hospital_id)
);

CREATE TABLE care_journeys (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    hospital_id BIGINT REFERENCES hospitals(id) ON DELETE SET NULL,
    current_stage VARCHAR(100) NOT NULL DEFAULT 'ADMISSION',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE journey_events (
    id BIGSERIAL PRIMARY KEY,
    journey_id BIGINT NOT NULL REFERENCES care_journeys(id) ON DELETE CASCADE,
    stage VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE policy_extractions (
    id BIGSERIAL PRIMARY KEY,
    policy_id BIGINT REFERENCES insurance_policies(id) ON DELETE CASCADE,
    raw_text TEXT,
    structured_json TEXT,
    confidence NUMERIC(5, 2) DEFAULT 1.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patient_user ON patients(user_id);
CREATE INDEX idx_policy_patient ON insurance_policies(patient_id);
CREATE INDEX idx_room_hospital ON room_categories(hospital_id);
CREATE INDEX idx_specialty_hospital ON hospital_specialties(hospital_id);
CREATE INDEX idx_journey_patient ON care_journeys(patient_id);
CREATE INDEX idx_journey_events ON journey_events(journey_id);
