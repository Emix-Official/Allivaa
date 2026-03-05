/**
 * Disability Category Schemas for Sense Aid Portal
 * Supports: Mutism, Blindness, Deafness
 */

// ============= MUTISM SCHEMAS =============

export type MutismType = 'selective_mutism' | 'total_mutism' | 'progressive_mutism';

export interface MutismProfile {
  id: string;
  userId: string;
  mutismType: MutismType;
  description: string;
  communicationMethods: CommunicationMethod[];
  supportNeeds: string[];
  accommodations: MutismAccommodation;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunicationMethod {
  id: string;
  type: 'sign_language' | 'text_to_speech' | 'writing' | 'gestures' | 'aac_device' | 'lip_reading';
  proficiency: 'basic' | 'intermediate' | 'advanced';
  notes?: string;
}

export interface MutismAccommodation {
  id: string;
  allowAlternativeCommunication: boolean;
  textToSpeechEnabled: boolean;
  allowWrittenSubmissions: boolean;
  allowVideoSubmissions: boolean;
  allowSignLanguageInterpreter: boolean;
  allowAACDevice: boolean;
  noOralPresentations: boolean;
  preferredPresentation: 'written' | 'video' | 'sign_language' | 'aac' | 'none';
  notes?: string;
}

// ============= BLINDNESS SCHEMAS =============

export type BlindnessLevel = 'legal_blind' | 'blind' | 'low_vision';

export interface BlindnessProfile {
  id: string;
  userId: string;
  blindnessLevel: BlindnessLevel;
  description: string;
  visionTools: VisionTool[];
  supportNeeds: string[];
  accommodations: BlindnessAccommodation;
  createdAt: Date;
  updatedAt: Date;
}

export interface VisionTool {
  id: string;
  type: 'screen_reader' | 'braille_display' | 'magnifier' | 'text_to_speech' | 'audio_description' | 'mobility_aid';
  name: string;
  proficiency: 'basic' | 'intermediate' | 'advanced';
  notes?: string;
}

export interface BlindnessAccommodation {
  id: string;
  screenReaderOptimized: boolean;
  brailleSupported: boolean;
  largeTextSupported: boolean;
  audioDescriptionsProvided: boolean;
  altTextRequired: boolean;
  highContrastMode: boolean;
  fontSizeOptions: boolean;
  keyboardNavigationEnabled: boolean;
  skipLinksProvided: boolean;
  notes?: string;
}

// ============= DEAFNESS SCHEMAS =============

export type DeafnessLevel = 'profound_deaf' | 'deaf' | 'hard_of_hearing';

export interface DeafnessProfile {
  id: string;
  userId: string;
  deafnessLevel: DeafnessLevel;
  description: string;
  communicationMethods: DeafCommunicationMethod[];
  supportNeeds: string[];
  accommodations: DeafnessAccommodation;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeafCommunicationMethod {
  id: string;
  type: 'sign_language' | 'lip_reading' | 'written_text' | 'hearing_aids' | 'cochlear_implant' | 'visual_aids';
  proficiency: 'basic' | 'intermediate' | 'advanced';
  notes?: string;
}

export interface DeafnessAccommodation {
  id: string;
  captionsEnabled: boolean;
  transcriptsProvided: boolean;
  signLanguageInterpreterAvailable: boolean;
  CART_Available: boolean;
  visualAlerts: boolean;
  captionedVideos: boolean;
  videoDescription: boolean;
  writeNotesOption: boolean;
  notes?: string;
}

// ============= UNIFIED DISABILITY PROFILE =============

export type DisabilityCategory = 'blind' | 'mute' | 'deaf' | 'general';

export interface UnifiedDisabilityProfile {
  userId: string;
  disabilityCategory: DisabilityCategory;
  mutismProfile?: MutismProfile;
  blindnessProfile?: BlindnessProfile;
  deafnessProfile?: DeafnessProfile;
  generalAccommodations?: GeneralAccommodation;
  verificationStatus: 'unverified' | 'pending' | 'verified';
  updatedAt: Date;
}

export interface GeneralAccommodation {
  id: string;
  customAccommodations: string[];
  additionalNeeds: string[];
  emergencyContacts: ContactInfo[];
  medicalDocumentation: Document[];
}

export interface ContactInfo {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface Document {
  id: string;
  type: 'medical_certificate' | 'disability_verification' | 'accommodation_letter' | 'other';
  fileName: string;
  url: string;
  uploadedAt: Date;
}

// ============= SERVICE OFFERING SCHEMAS =============

export interface ServiceOffering {
  id: string;
  disabilityType: DisabilityCategory;
  services: Service[];
  description: string;
  availability: 'always' | 'on_request' | 'limited';
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  availability: string;
  contactMethod: string;
}

// ============= SUPPORT RESOURCE SCHEMAS =============

export interface SupportResource {
  id: string;
  title: string;
  description: string;
  disabilityType: DisabilityCategory[];
  resourceType: 'guide' | 'tool' | 'contact' | 'service' | 'video' | 'article';
  url?: string;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============= ACCOMMODATION REQUEST SCHEMAS =============

export interface AccommodationRequest {
  id: string;
  userId: string;
  disabilityType: DisabilityCategory;
  accommodationType: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  notes?: string;
}

// ============= INSTRUCTOR NOTES SCHEMAS =============

export interface InstructorNotes {
  id: string;
  courseId: string;
  studentId: string;
  disabilityType: DisabilityCategory;
  accommodationNotes: string;
  assessmentModification: string;
  submissionModification: string;
  createdAt: Date;
  updatedAt: Date;
}
