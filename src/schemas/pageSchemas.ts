/**
 * Page and Content Schemas for Sense Aid Portal
 */

export interface PageContent {
  id: string;
  pageType: 'intro' | 'services' | 'student_dashboard' | 'resources' | 'testimonials';
  title: string;
  description: string;
  sections: PageSection[];
  metadata: PageMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface PageSection {
  id: string;
  type: 'hero' | 'content' | 'gallery' | 'services' | 'cta' | 'footer' | 'testimonials';
  title?: string;
  content?: string;
  items?: SectionItem[];
  alignment?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  textColor?: string;
}

export interface SectionItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  link?: string;
  metadata?: Record<string, unknown>;
}

export interface PageMetadata {
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  accessibility: AccessibilityMeta;
}

export interface AccessibilityMeta {
  altTextsProvided: boolean;
  keyboardNavigable: boolean;
  screenReaderOptimized: boolean;
  contrastCompliant: boolean;
  captionsAvailable: boolean;
}

// ============= INTRO PAGE SCHEMA =============

export interface IntroPageContent {
  disabilityType: 'blind' | 'mute' | 'deaf';
  heroSection: HeroSection;
  introSection: IntroSection;
  typesSection: TypesSection;
  servicesSection: ServicesSection;
  getStartedSection: GetStartedSection;
  footer: Footer;
}

export interface HeroSection {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaButton: {
    text: string;
    link: string;
  };
}

export interface IntroSection {
  title: string;
  paragraphs: string[];
  highlights: string[];
}

export interface TypesSection {
  title: string;
  description: string;
  types: DisabilityTypeItem[];
}

export interface DisabilityTypeItem {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  characteristics: string[];
  details: string;
}

export interface ServicesSection {
  title: string;
  description: string;
  services: ServiceItem[];
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  availability: string;
}

export interface GetStartedSection {
  title: string;
  description: string;
  ctaButton: {
    text: string;
    link: string;
  };
  secondaryButton?: {
    text: string;
    link: string;
  };
}

export interface Footer {
  companyName: string;
  joinUs: FooterLink[];
  social: FooterLink[];
  senseAid: FooterLink[];
  contact: ContactSection;
}

export interface FooterLink {
  text: string;
  link: string;
  icon?: string;
}

export interface ContactSection {
  title: string;
  phone: string;
  email: string;
  faq: string;
  terms: string;
}

// ============= MUTISM TYPES SCHEMA =============

export interface MutismTypesContent {
  selectiveMutism: MutismTypeDetail;
  totalMutism: MutismTypeDetail;
  progressiveMutism: MutismTypeDetail;
}

export interface MutismTypeDetail {
  name: string;
  description: string;
  image: string;
  characteristics: string[];
  challengesForStudents: string[];
  supportStrategies: string[];
  accommodations: string[];
}

// ============= BLINDNESS TYPES SCHEMA =============

export interface BlindnessTypesContent {
  legalBlindness: BlindnessTypeDetail;
  totalBlindness: BlindnessTypeDetail;
  lowVision: BlindnessTypeDetail;
}

export interface BlindnessTypeDetail {
  name: string;
  description: string;
  image: string;
  characteristics: string[];
  challengesForStudents: string[];
  supportStrategies: string[];
  tools: string[];
  accommodations: string[];
}

// ============= DEAFNESS TYPES SCHEMA =============

export interface DeafnessTypesContent {
  profoundDeafness: DeafnessTypeDetail;
  totalDeafness: DeafnessTypeDetail;
  hardOfHearing: DeafnessTypeDetail;
}

export interface DeafnessTypeDetail {
  name: string;
  description: string;
  image: string;
  characteristics: string[];
  challengesForStudents: string[];
  communicationMethods: string[];
  supportStrategies: string[];
  accommodations: string[];
}

// ============= STUDENT DASHBOARD SCHEMA =============

export interface StudentDashboardContent {
  userId: string;
  disabilityProfile: UnifiedDisabilityProfile;
  personalizedAccommodations: PersonalizedAccommodation[];
  upcomingAppointments: Appointment[];
  resources: DashboardResource[];
  messages: DashboardMessage[];
  academicProgress: AcademicProgress;
}

export interface PersonalizedAccommodation {
  id: string;
  type: string;
  description: string;
  status: 'active' | 'pending' | 'expired';
  expiryDate?: Date;
  notes: string;
}

export interface Appointment {
  id: string;
  type: string;
  date: Date;
  time: string;
  location: string;
  provider: string;
  notes?: string;
}

export interface DashboardResource {
  id: string;
  title: string;
  type: string;
  url: string;
  relevance: 'high' | 'medium' | 'low';
}

export interface DashboardMessage {
  id: string;
  from: string;
  subject: string;
  timestamp: Date;
  read: boolean;
}

export interface AcademicProgress {
  gpa: number;
  coursesEnrolled: number;
  completedCourses: number;
  onTrack: boolean;
  nextMilestone: string;
}

// ============= SUPPORT & RESOURCES SCHEMA =============

export interface SupportHub {
  id: string;
  sections: SupportSection[];
  faqs: FAQ[];
  contacts: SupportContact[];
  emergencyResources: EmergencyResource[];
}

export interface SupportSection {
  id: string;
  title: string;
  description: string;
  articles: Article[];
  tools: Tool[];
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  tags: string[];
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  isFree: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

export interface SupportContact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  availability: string;
  specialization: string[];
}

export interface EmergencyResource {
  id: string;
  name: string;
  description: string;
  phone: string;
  website: string;
  available24_7: boolean;
  serviceType: string;
}

// Import UnifiedDisabilityProfile for type reference
import { UnifiedDisabilityProfile } from './disabilitySchemas';
