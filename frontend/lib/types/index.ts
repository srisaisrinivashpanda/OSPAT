// OSPAT Types - 1:1 Mapping with Spring Boot DTOs

export interface PatientDto {
  id: number;
  name: string;
  age: number;
}

export interface NetworkHospitalItemDto {
  hospitalId: number;
  hospitalName: string;
  location: string;
}

export interface PolicyResponseDto {
  id: number;
  patientId: number;
  patientName: string;
  insurerName: string;
  policyType: string;
  coverageLimit: number;
  remainingCoverage: number;
  indicativeRemainingBalance?: number;
  roomLimit: number;
  roomCategory: string;
  policyStatus: 'DRAFT' | 'ACTIVE';
  sourceDocument?: string;
  confirmed: boolean;
  createdAt?: string;
  updatedAt?: string;
  exclusions: string[];
  networkHospitals: NetworkHospitalItemDto[];
}

export interface ExtractedPolicyDto {
  policyId?: number;
  insurerName: string;
  policyType: string;
  coverageLimit: number;
  roomLimit: number;
  roomCategory: string;
  networkHospitals: string[];
  exclusions: string[];
  otherConstraints: string[];
  rawText?: string;
  confidence: number;
}

export interface PolicyUpdateRequestDto {
  insurerName: string;
  policyType: string;
  coverageLimit: number;
  remainingCoverage?: number;
  roomLimit: number;
  roomCategory: string;
  confirmed: boolean;
  exclusions?: string[];
  networkHospitalIds?: number[];
}

export interface RoomCategoryDto {
  id: number;
  name: string;
  dailyCost: number;
  available: boolean;
}

export interface HospitalDto {
  id: number;
  name: string;
  location: string;
  address?: string;
  networkStatus: 'IN_NETWORK' | 'OUT_OF_NETWORK';
  description?: string;
  specialties: string[];
  roomCategories: RoomCategoryDto[];
}

export type RoomCompatibilityStatus =
  | 'WITHIN_STATED_LIMIT'
  | 'POLICY_CONSIDERATION'
  | 'EXCEEDS_STATED_LIMIT'
  | 'INFORMATION_UNAVAILABLE';

export interface RoomEvaluationDto {
  roomId: number;
  roomName: string;
  dailyCost: number;
  policyLimit: number;
  costDifference: number;
  withinPolicyLimit: boolean | null;
  available: boolean;
  compatibilityStatus: RoomCompatibilityStatus;
  advisoryNote: string;
}

export type ScoreRating = 'HIGH_COMPATIBILITY' | 'MODERATE_COMPATIBILITY' | 'LOW_COMPATIBILITY';

export interface HospitalMatchResultDto {
  hospitalId: number;
  hospitalName: string;
  location: string;
  address?: string;
  networkStatus: 'IN_NETWORK' | 'OUT_OF_NETWORK';
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
  caregiverSummary?: string;
  specialties: string[];
  roomEvaluations: RoomEvaluationDto[];
  lowestEligibleRoomCost?: number;
  highestRoomCost?: number;
  hasEligibleRoom: boolean;
}

export interface HospitalMatchRequestDto {
  policyId?: number;
  patientId?: number;
  specialty?: string;
  location?: string;
}

export type JourneyStage = 'ADMISSION' | 'INVESTIGATION' | 'PROCEDURE' | 'RECOVERY';

export interface JourneyEventDto {
  id?: number;
  stage: JourneyStage;
  description: string;
  timestamp: string;
}

export interface CareJourneyDto {
  id: number;
  patientId: number;
  patientName: string;
  hospitalId: number;
  hospitalName: string;
  hospitalLocation: string;
  currentStage: JourneyStage;
  createdAt?: string;
  updatedAt?: string;
  events: JourneyEventDto[];
}

export interface JourneyStageUpdateRequestDto {
  stage: JourneyStage;
  note?: string;
}

export interface StageGuidanceDto {
  stage: JourneyStage;
  stageTitle: string;
  description: string;
  insuranceInsights: string[];
  potentialConstraints: string[];
  caregiverQuestionsToAsk: string[];
  requiredDocuments: string[];
  disclaimer: string;
}

export interface JourneyContextDto {
  journeyId: number;
  patientId: number;
  patientName: string;
  hospitalId: number;
  hospitalName: string;
  hospitalLocation: string;
  currentStage: JourneyStage;
  coverageLimit: number;
  remainingCoverage: number;
  indicativeRemainingBalance?: number;
  roomLimit: number;
  networkStatus: string;
  currentStageGuidance: StageGuidanceDto;
}

export interface DashboardSummaryDto {
  patientId: number;
  patientName: string;
  patientAge: number;
  activePolicy: PolicyResponseDto | null;
  activeJourney: CareJourneyDto | null;
  currentStageGuidance: StageGuidanceDto | null;
  totalCoverageLimit: number;
  remainingCoverage: number;
  indicativeRemainingBalance?: number;
  roomDailyLimit: number;
  roomCategory: string;
  networkHospitalsCount: number;
  totalHospitalsAvailable: number;
  recentAlerts: string[];
  recommendedActions: string[];
}

export interface AIExplainRequestDto {
  policyId?: number;
  hospitalId?: number;
  stage?: string;
}

export interface AIExplainResponseDto {
  explanation: string;
  disclaimer: string;
  providerUsed: string;
}

export interface ErrorResponseDto {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
