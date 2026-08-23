-- V2__seed_data.sql
-- Synthetic seed data for Hospitality Decision-Support Prototype

-- Synthetic Users & Patients
INSERT INTO users (id, name, email) VALUES
(1, 'Rahul Verma (Caregiver)', 'rahul.verma@example.com'),
(2, 'Sunita Rao (Caregiver)', 'sunita.rao@example.com');

INSERT INTO patients (id, user_id, name, age) VALUES
(1, 1, 'Rajesh Verma', 58),
(2, 1, 'Anita Verma', 54),
(3, 2, 'Ramesh Rao', 67);

-- 10 Synthetic Hospitals
INSERT INTO hospitals (id, name, location, address, network_status, description) VALUES
(1, 'Apex Multi-Specialty Hospital', 'Indiranagar, Bengaluru', '12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, KA 560038', 'IN_NETWORK', 'Tertiary multi-specialty healthcare center renowned for cardiology, orthopedics, and advanced surgical care.'),
(2, 'Metro Care Medical Institute', 'Koramangala, Bengaluru', '80 Feet Road, 4th Block, Koramangala, Bengaluru, KA 560034', 'IN_NETWORK', 'Advanced emergency and surgical care facility with 24/7 cashless insurance desk and specialty ICU wings.'),
(3, 'St. Jude Memorial Health Center', 'Whitefield, Bengaluru', 'ITPL Main Road, Whitefield, Bengaluru, KA 560066', 'IN_NETWORK', 'Comprehensive oncology, neurology, and general surgery center equipped with modern diagnostic laboratories.'),
(4, 'Zenith Super Speciality Hospital', 'Jayanagar, Bengaluru', '9th Block, Jayanagar, Bengaluru, KA 560069', 'IN_NETWORK', 'Specialized center for gastroenterology, nephrology, and minimally invasive laparoscopic procedures.'),
(5, 'Fortis Escorts Care Center', 'Bannerghatta Road, Bengaluru', '154/9, Bannerghatta Road, Opp IIMB, Bengaluru, KA 560076', 'IN_NETWORK', 'Premier quaternary care institute with dedicated cardiac catheterization labs and robotic surgery suites.'),
(6, 'Manipal Lifecare Hospital', 'Old Airport Road, Bengaluru', '98, HAL Old Airport Road, Kodihalli, Bengaluru, KA 560017', 'IN_NETWORK', 'Multi-disciplinary healthcare facility featuring 24x7 trauma care, organ transplant, and vascular surgery units.'),
(7, 'Narayana Health City', 'Bommasandra, Bengaluru', '258/A, Bommasandra Industrial Area, Anekal Taluk, Bengaluru, KA 560099', 'IN_NETWORK', 'High-volume clinical excellence center offering affordable specialty cardiac and neurosurgical treatments.'),
(8, 'Aster CMI Healthcare', 'Hebbal, Bengaluru', 'No. 43/2, New Airport Road, NH 44, Sahakar Nagar, Hebbal, Bengaluru, KA 560092', 'OUT_OF_NETWORK', 'Modern premium healthcare hospital with international accreditation and robotic surgical facilities.'),
(9, 'Columbia Asia Care Hospital', 'Yeshwanthpur, Bengaluru', '26/4, Brigade Gateway, Malleshwaram West, Yeshwanthpur, Bengaluru, KA 560055', 'IN_NETWORK', 'Well-equipped tertiary facility known for internal medicine, pulmonology, and pediatric emergency services.'),
(10, 'Lifeline Community Hospital', 'Malleshwaram, Bengaluru', '17th Cross, Margosa Road, Malleshwaram, Bengaluru, KA 560003', 'OUT_OF_NETWORK', 'Community healthcare hospital providing general medicine, maternal health, and day-care surgical units.');

-- Specialties
INSERT INTO hospital_specialties (hospital_id, specialty) VALUES
(1, 'Cardiology'), (1, 'Orthopedics'), (1, 'General Surgery'), (1, 'Critical Care'),
(2, 'Neurology'), (2, 'Orthopedics'), (2, 'Emergency Medicine'), (2, 'Urology'),
(3, 'Oncology'), (3, 'Cardiology'), (3, 'General Surgery'), (3, 'Radiology'),
(4, 'Gastroenterology'), (4, 'Nephrology'), (4, 'Laparoscopic Surgery'),
(5, 'Cardiac Surgery'), (5, 'Interventional Cardiology'), (5, 'Vascular Surgery'),
(6, 'Multispecialty Care'), (6, 'Organ Transplant'), (6, 'Joint Replacement'),
(7, 'Pediatric Cardiology'), (7, 'Cardiac Care'), (7, 'Neurosurgery'),
(8, 'Robotic Surgery'), (8, 'Bariatric Surgery'), (8, 'Medical Oncology'),
(9, 'Pulmonology'), (9, 'Internal Medicine'), (9, 'ENT & Head Neck Surgery'),
(10, 'General Medicine'), (10, 'Obstetrics & Gynecology'), (10, 'Day Care Surgery');

-- Room Categories (25+ room tiers across hospitals)
INSERT INTO room_categories (id, hospital_id, name, daily_cost, available) VALUES
-- Hospital 1 (Apex)
(1, 1, 'General Sharing Ward (4-Bed)', 1800.00, TRUE),
(2, 1, 'Semi-Private Room (Twin Sharing)', 3800.00, TRUE),
(3, 1, 'Single Private Deluxe AC', 6500.00, TRUE),
(4, 1, 'Super Deluxe Suite', 12500.00, TRUE),
(5, 1, 'Intensive Care Unit (ICU)', 11000.00, TRUE),

-- Hospital 2 (Metro Care)
(6, 2, 'General Multi-Bed Ward', 1600.00, TRUE),
(7, 2, 'Semi-Private (Twin Sharing AC)', 4000.00, TRUE),
(8, 2, 'Single Private Room AC', 6200.00, TRUE),
(9, 2, 'Executive Suite', 14000.00, FALSE),

-- Hospital 3 (St. Jude)
(10, 3, 'General Ward', 1500.00, TRUE),
(11, 3, 'Semi-Private Room', 3600.00, TRUE),
(12, 3, 'Single Room AC', 5800.00, TRUE),
(13, 3, 'Special Care Unit (HDU/ICU)', 9500.00, TRUE),

-- Hospital 4 (Zenith)
(14, 4, 'Twin Sharing Room', 3900.00, TRUE),
(15, 4, 'Single Private AC', 7000.00, TRUE),
(16, 4, 'VIP Suite Room', 15000.00, TRUE),

-- Hospital 5 (Fortis)
(17, 5, 'Semi-Private Room', 4500.00, TRUE),
(18, 5, 'Single Standard Room', 8000.00, TRUE),
(19, 5, 'Premium Suite', 16500.00, TRUE),

-- Hospital 6 (Manipal)
(20, 6, 'General Ward', 2000.00, TRUE),
(21, 6, 'Semi-Private AC', 4200.00, TRUE),
(22, 6, 'Single Deluxe Room', 7500.00, TRUE),

-- Hospital 7 (Narayana)
(23, 7, 'General Economy Ward', 1200.00, TRUE),
(24, 7, 'Semi-Private Sharing', 3200.00, TRUE),
(25, 7, 'Single Private AC', 5200.00, TRUE),

-- Hospital 8 (Aster - Out of network)
(26, 8, 'Single Standard AC', 7800.00, TRUE),
(27, 8, 'Deluxe Suite', 16000.00, TRUE),

-- Hospital 9 (Columbia Asia)
(28, 9, 'Twin Sharing Semi-Private', 3800.00, TRUE),
(29, 9, 'Single Private AC', 6800.00, TRUE),

-- Hospital 10 (Lifeline)
(30, 10, 'General Ward', 1400.00, TRUE),
(31, 10, 'Semi-Private Room', 3000.00, TRUE);

-- 5 Synthetic Insurance Policies
INSERT INTO insurance_policies (id, patient_id, insurer_name, policy_type, coverage_limit, remaining_coverage, room_limit, room_category, policy_status, source_document, confirmed, created_at, updated_at) VALUES
(1, 1, 'Star Health Allied Insurance', 'Family Health Optima Comprehensive', 500000.00, 475000.00, 5000.00, 'Semi-Private (Twin Sharing)', 'ACTIVE', 'StarHealth_FamilyOptima_Sample.pdf', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 2, 'HDFC ERGO Health Insurance', 'Optima Restore Individual Cover', 1000000.00, 1000000.00, 8000.00, 'Single Private Room AC', 'ACTIVE', 'HDFCErgo_OptimaRestore_Sample.pdf', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 3, 'Care Health Insurance', 'Care Advantage Senior Protection', 750000.00, 680000.00, 4000.00, 'Semi-Private (Twin Sharing)', 'ACTIVE', 'CareHealth_Advantage_Sample.pdf', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 1, 'Niva Bupa Health Insurance', 'ReAssure 2.0 Titanium Plan', 1500000.00, 1500000.00, 12000.00, 'Single Deluxe Room / Suite', 'DRAFT', 'NivaBupa_ReAssure_Sample.pdf', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 2, 'National Insurance Company', 'Mediclaim Standard Health Policy', 300000.00, 300000.00, 3000.00, 'General / Twin Sharing Ward', 'DRAFT', 'NationalInsurance_Mediclaim_Sample.pdf', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Policy Exclusions
INSERT INTO policy_exclusions (policy_id, description) VALUES
(1, 'Cosmetic, aesthetic, or obesity-related treatments and surgeries are not covered.'),
(1, 'Pre-existing illnesses have a mandatory 36-month waiting period from inception.'),
(1, 'Non-medical consumables (gloves, syringes, sanitizers, administrative fees) are non-payable.'),
(1, 'Experimental and unproven diagnostic tests without formal clinical justification are excluded.'),

(2, 'Maternity and newborn child expenses are excluded unless explicitly endorsed in policy add-on.'),
(2, 'Dental treatments and procedures unless necessitated by accidental trauma requiring hospitalization.'),
(2, 'Outpatient consultation charges and pharmacy outside hospitalization window are excluded.'),

(3, 'Joint replacement surgery requires a 24-month waiting period unless caused by road traffic accident.'),
(3, 'Investigation and evaluation admissions without active therapeutic or surgical intervention are excluded.'),
(3, 'Alternative therapies (AYUSH) capped at 20% of the total sum insured limit per policy year.');

-- Network Hospital Mappings for Policy 1 (Star Health)
INSERT INTO network_hospitals (policy_id, hospital_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 9);

-- Network Hospital Mappings for Policy 2 (HDFC Ergo)
INSERT INTO network_hospitals (policy_id, hospital_id) VALUES
(2, 1), (2, 2), (2, 3), (2, 5), (2, 6), (2, 7), (2, 8), (2, 9);

-- Network Hospital Mappings for Policy 3 (Care Health)
INSERT INTO network_hospitals (policy_id, hospital_id) VALUES
(3, 1), (3, 2), (3, 4), (3, 7), (3, 9), (3, 10);

-- Active Care Journey for Patient 1 at Apex Hospital
INSERT INTO care_journeys (id, patient_id, hospital_id, current_stage, created_at, updated_at) VALUES
(1, 1, 1, 'ADMISSION', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO journey_events (journey_id, stage, description, timestamp) VALUES
(1, 'ADMISSION', 'Patient checked in at Apex Multi-Specialty Hospital TPA Cashless Desk. Policy verified.', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(1, 'ADMISSION', 'Pre-authorization request of INR 45,000 submitted to Star Health Allied Insurance.', CURRENT_TIMESTAMP - INTERVAL '1 hour');

-- Reset sequences to prevent key conflicts
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('patients_id_seq', (SELECT COALESCE(MAX(id), 1) FROM patients));
SELECT setval('hospitals_id_seq', (SELECT COALESCE(MAX(id), 1) FROM hospitals));
SELECT setval('room_categories_id_seq', (SELECT COALESCE(MAX(id), 1) FROM room_categories));
SELECT setval('insurance_policies_id_seq', (SELECT COALESCE(MAX(id), 1) FROM insurance_policies));
SELECT setval('policy_exclusions_id_seq', (SELECT COALESCE(MAX(id), 1) FROM policy_exclusions));
SELECT setval('network_hospitals_id_seq', (SELECT COALESCE(MAX(id), 1) FROM network_hospitals));
SELECT setval('care_journeys_id_seq', (SELECT COALESCE(MAX(id), 1) FROM care_journeys));
SELECT setval('journey_events_id_seq', (SELECT COALESCE(MAX(id), 1) FROM journey_events));
