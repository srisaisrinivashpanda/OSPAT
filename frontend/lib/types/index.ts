export interface ExtractedPolicyDto {
  insurerName?: string;
  policyType?: string;
  coverageLimit?: number;
  roomLimit?: number;
  roomCategory?: string;
  networkHospitals: string[];
  exclusions: string[];
  otherConstraints: string[];
  rawText?: string;
  confidence?: number;
  policyId?: number;
}

export interface NetworkHospitalItemDto {
  hospitalId?: number;
  hospitalName: string;
  location?: string;
  matchedInDatabase: boolean;
}

export interface PolicyResponseDto {
  id: number;
  patientId: number;
  patientName?: string;
  insurerName: string;
  policyType: string;
  coverageLimit: number;
  remainingCoverage?: number;
  roomLimit?: number;
  roomCategory?: string;
  policyStatus: 'DRAFT' | 'ACTIVE';
  sourceDocument?: string;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
  exclusions: string[];
  networkHospitals: NetworkHospitalItemDto[];
}

export interface PolicyUpdateRequestDto {
  insurerName: string;
  policyType?: string;
  coverageLimit: number;
  remainingCoverage?: number;
  roomLimit: number;
  roomCategory?: string;
  confirmed?: boolean;
  exclusions?: string[];
  networkHospitalIds?: number[];
}

export interface RoomCategoryDto {
  id: number;
  hospitalId: number;
  categoryName: string;
  dailyRate: number;
  description?: string;
  available: boolean;
}

export interface RoomEvaluationDto {
  roomId: number;
  roomName: string;
  dailyCost: number;
  policyLimit?: number;
  costDifference?: number;
  withinPolicyLimit: boolean;
  available: boolean;
  compatibilityStatus: 'WITHIN_STATED_LIMIT' | 'POLICY_CONSIDERATION' | 'EXCEEDS_STATED_LIMIT' | 'INFORMATION_UNAVAILABLE';
  advisoryNote?: string;
}

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
  scoreRating: 'HIGH_COMPATIBILITY' | 'MODERATE_COMPATIBILITY' | 'LOW_COMPATIBILITY';
  matchingFactors: string[];
  considerations: string[];
  caregiverSummary?: string;
  specialties: string[];
  roomEvaluations: RoomEvaluationDto[];
  lowestEligibleRoomCost?: number;
  highestRoomCost?: number;
  hasEligibleRoom: boolean;
}

export interface HospitalDto {
  id: number;
  name: string;
  location: string;
  address?: string;
  contactNumber?: string;
  emergencyContact?: string;
  tpaDeskContact?: string;
  specialties: string[];
  roomCategories: RoomCategoryDto[];
}

export interface HospitalMatchRequestDto {
  policyId?: number;
  patientId?: number;
  specialty?: string;
  location?: string;
}

export interface JourneyEventDto {
  id: number;
  stage: string;
  description?: string;
  timestamp: string;
}

export interface CareJourneyDto {
  id: number;
  patientId: number;
  patientName?: string;
  hospitalId: number;
  hospitalName?: string;
  hospitalLocation?: string;
  currentStage: 'ADMISSION' | 'INVESTIGATION' | 'PROCEDURE' | 'RECOVERY';
  createdAt: string;
  updatedAt: string;
  events: JourneyEventDto[];
}

export interface StageGuidanceDto {
  stage: string;
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
  currentStage: 'ADMISSION' | 'INVESTIGATION' | 'PROCEDURE' | 'RECOVERY';
  coverageLimit: number;
  remainingCoverage?: number;
  roomLimit?: number;
  networkStatus: string;
  currentStageGuidance?: StageGuidanceDto;
}

export interface JourneyStageUpdateRequestDto {
  stage: 'ADMISSION' | 'INVESTIGATION' | 'PROCEDURE' | 'RECOVERY';
  note?: string;
}

export interface AIExplainRequestDto {
  policyId?: number;
  hospitalId?: number;
  stage?: string;
}

export interface AIExplainResponseDto {
  explanation: string;
  disclaimer: string;
  providerUsed?: string;
}
