// ============================================================
// OSPAT Frontend Types — mirrors backend DTO contracts exactly
// ============================================================

export type PolicyStatus = 'DRAFT' | 'ACTIVE';
export type JourneyStage = 'ADMISSION' | 'INVESTIGATION' | 'PROCEDURE' | 'RECOVERY';
export type NetworkStatus = 'IN_NETWORK' | 'OUT_OF_NETWORK' | 'UNKNOWN';
export type ScoreRating = 'HIGH_COMPATIBILITY' | 'MODERATE_COMPATIBILITY' | 'LOW_COMPATIBILITY';
export type CompatibilityStatus =
  | 'WITHIN_STATED_LIMIT'
  | 'POLICY_CONSIDERATION'
  | 'EXCEEDS_STATED_LIMIT'
  | 'INFORMATION_UNAVAILABLE';

// ── Policy ──────────────────────────────────────────────────

export interface NetworkHospitalItem {
  hospitalId: number;
  hospitalName: string;
  location: string;
}

export interface PolicyResponse {
  id: number;
  patientId: number | null;
  patientName: string;
  insurerName: string | null;
  policyType: string | null;
  coverageLimit: number;
  remainingCoverage: number;
  indicativeRemainingBalance: number;
  roomLimit: number;
  roomCategory: string | null;
  policyStatus: PolicyStatus;
  sourceDocument: string | null;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
  exclusions: string[];
  networkHospitals: NetworkHospitalItem[];
}

export interface ExtractedPolicy {
  policyId: number | null;
  insurerName: string | null;
  policyType: string | null;
  coverageLimit: number | null;
  roomLimit: number | null;
  roomCategory: string | null;
  networkHospitals: string[];
  exclusions: string[];
  otherConstraints: string[];
  rawText: string | null;
  confidence: number | null;
}

export interface PolicyUpdateRequest {
  insurerName: string;
  policyType: string | null;
  coverageLimit: number;
  remainingCoverage: number | null;
  roomLimit: number;
  roomCategory: string | null;
  confirmed: boolean;
  exclusions: string[];
  networkHospitalIds: number[];
}

// ── Hospital ─────────────────────────────────────────────────

export interface RoomCategory {
  id: number;
  name: string;
  dailyCost: number;
  available: boolean;
}

export interface Hospital {
  id: number;
  name: string;
  location: string;
  address: string;
  networkStatus: NetworkStatus;
  description: string;
  specialties: string[];
  roomCategories: RoomCategory[];
}

export interface RoomEvaluation {
  roomId: number;
  roomName: string;
  dailyCost: number;
  policyLimit: number;
  costDifference: number;
  withinPolicyLimit: boolean | null;
  available: boolean;
  compatibilityStatus: CompatibilityStatus;
  advisoryNote: string;
}

export interface HospitalMatchRequest {
  policyId?: number | null;
  patientId?: number | null;
  specialty?: string | null;
  location?: string | null;
}

export interface HospitalMatchResult {
  hospitalId: number;
  hospitalName: string;
  location: string;
  address: string;
  networkStatus: NetworkStatus;
  isNetworkMatch: boolean;
  compatibilityScore: number;
  totalScore: number;
  networkScore: number;
  roomScore: number;
  specialtyScore: number;
  policyConstraintScore: number;
  scoreRating: ScoreRating;
  matchingFactors: string[];
  considerations: string[];
  caregiverSummary: string;
  specialties: string[];
  roomEvaluations: RoomEvaluation[];
  lowestEligibleRoomCost: number | null;
  highestRoomCost: number | null;
  hasEligibleRoom: boolean;
}

// ── Care Journey ──────────────────────────────────────────────

export interface JourneyEvent {
  id: number;
  stage: string;
  description: string;
  timestamp: string;
}

export interface CareJourney {
  id: number;
  patientId: number | null;
  patientName: string;
  hospitalId: number | null;
  hospitalName: string;
  hospitalLocation: string;
  currentStage: JourneyStage;
  createdAt: string;
  updatedAt: string;
  events: JourneyEvent[];
}

export interface JourneyStageUpdateRequest {
  stage: string;
  note: string | null;
}

export interface StageGuidance {
  stage: JourneyStage;
  stageTitle: string;
  description: string;
  insuranceInsights: string[];
  potentialConstraints: string[];
  caregiverQuestionsToAsk: string[];
  requiredDocuments: string[];
  disclaimer: string;
}

export interface JourneyContext {
  journeyId: number;
  patientId: number;
  patientName: string;
  hospitalId: number | null;
  hospitalName: string;
  hospitalLocation: string;
  currentStage: JourneyStage;
  coverageLimit: number;
  remainingCoverage: number;
  indicativeRemainingBalance: number;
  roomLimit: number;
  networkStatus: NetworkStatus;
  currentStageGuidance: StageGuidance;
}

// ── Dashboard ─────────────────────────────────────────────────

export interface DashboardSummary {
  patientId: number;
  patientName: string;
  patientAge: number;
  activePolicy: PolicyResponse | null;
  activeJourney: CareJourney | null;
  currentStageGuidance: StageGuidance | null;
  totalCoverageLimit: number;
  remainingCoverage: number;
  indicativeRemainingBalance: number;
  roomDailyLimit: number;
  roomCategory: string;
  networkHospitalsCount: number;
  totalHospitalsAvailable: number;
  recentAlerts: string[];
  recommendedActions: string[];
}

// ── AI ────────────────────────────────────────────────────────

export interface AIExplainRequest {
  policyId?: number | null;
  hospitalId?: number | null;
  stage?: string | null;
}

export interface AIExplainResponse {
  explanation: string;
  disclaimer: string;
  providerUsed: string;
}

// ── Error ─────────────────────────────────────────────────────

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors: Record<string, string> | null;
}

// ── Sample PDF types ──────────────────────────────────────────

export type SamplePdfType = 'star' | 'hdfc' | 'care';
