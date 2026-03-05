/**
 * API Request/Response and Data Service Schemas
 */

// ============= API RESPONSE SCHEMAS =============

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: Date;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ============= AUTH SCHEMAS =============

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData extends AuthCredentials {
  name: string;
  studentId: string;
  disabilityCategory: 'blind' | 'mute' | 'deaf' | 'general';
  department: string;
  agreeToTerms: boolean;
}

export interface AuthResponse {
  user: UserData;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  studentId: string;
  disabilityCategory: 'blind' | 'mute' | 'deaf' | 'general';
  department: string;
  avatar?: string;
  verificationStatus: 'unverified' | 'pending' | 'verified';
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// ============= PROFILE SCHEMAS =============

export interface ProfileUpdateRequest {
  name?: string;
  email?: string;
  avatar?: string;
  disabilityProfile?: DisabilityProfileUpdate;
}

export interface DisabilityProfileUpdate {
  disabilityCategory: 'blind' | 'mute' | 'deaf' | 'general';
  details?: Record<string, unknown>;
  accommodations?: string[];
  communicationMethods?: string[];
}

// ============= COURSE SCHEMAS =============

export interface CourseEnrollmentRequest {
  courseId: string;
  accommodationsNeeded?: string[];
}

export interface CourseUpdate {
  id: string;
  name?: string;
  description?: string;
  schedule?: string;
}

export interface AssignmentSubmission {
  assignmentId: string;
  submissionUrl: string;
  submissionType: 'file' | 'link' | 'text';
  submittedAt: Date;
}

// ============= ACCOMMODATION REQUEST SCHEMAS =============

export interface CreateAccommodationRequest {
  disabilityType: 'blind' | 'mute' | 'deaf' | 'general';
  accommodationType: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  supportingDocuments?: string[];
}

export interface AccommodationRequestUpdate {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  notes?: string;
  reviewedBy?: string;
}

// ============= RESOURCE SCHEMAS =============

export interface ResourceUploadRequest {
  title: string;
  type: 'pdf' | 'video' | 'audio' | 'document' | 'link';
  file?: File;
  url?: string;
  description: string;
  accessibilityNotes: string;
  courseId?: string;
}

export interface ResourceUpdateRequest {
  id: string;
  title?: string;
  description?: string;
  accessibilityNotes?: string;
}

// ============= MESSAGE SCHEMAS =============

export interface SendMessageRequest {
  recipientId: string;
  subject?: string;
  content: string;
  attachments?: string[];
}

export interface MessageThread {
  id: string;
  participantIds: string[];
  subject?: string;
  messages: MessageDetail[];
  lastMessageAt: Date;
}

export interface MessageDetail {
  id: string;
  senderId: string;
  content: string;
  attachments?: string[];
  sentAt: Date;
  readAt?: Date;
}

// ============= NOTIFICATION SCHEMAS =============

export interface NotificationConfig {
  userId: string;
  emailNotifications: boolean;
  inAppNotifications: boolean;
  pushNotifications: boolean;
  notificationPreferences: Record<string, boolean>;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'accommodation' | 'course' | 'message' | 'announcement' | 'system';
  title: string;
  message: string;
  icon?: string;
  actionUrl?: string;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

// ============= SEARCH SCHEMAS =============

export interface SearchQuery {
  q: string;
  filters?: SearchFilter[];
  sort?: SearchSort;
  page?: number;
  limit?: number;
}

export interface SearchFilter {
  field: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'in';
  value: unknown;
}

export interface SearchSort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  facets: SearchFacet[];
}

export interface SearchFacet {
  field: string;
  values: {
    value: string;
    count: number;
  }[];
}

// ============= ANALYTICS SCHEMAS =============

export interface AnalyticsEvent {
  eventName: string;
  userId?: string;
  timestamp: Date;
  properties: Record<string, unknown>;
  category: 'engagement' | 'conversion' | 'error' | 'performance' | 'accessibility';
}

export interface UserAnalytics {
  userId: string;
  totalSessions: number;
  totalSessionDuration: number;
  lastActiveAt: Date;
  pageViews: PageView[];
  events: AnalyticsEvent[];
}

export interface PageView {
  page: string;
  timestamp: Date;
  duration: number;
  referrer?: string;
}

// ============= FEEDBACK SCHEMAS =============

export interface FeedbackSubmission {
  type: 'bug_report' | 'feature_request' | 'accessibility' | 'general_feedback';
  title: string;
  description: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  attachments?: string[];
  contactInfo?: {
    email: string;
    phone?: string;
  };
}

export interface FeedbackResponse {
  id: string;
  feedback: FeedbackSubmission;
  status: 'open' | 'in_review' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============= BULK OPERATION SCHEMAS =============

export interface BulkOperation {
  id: string;
  type: 'import' | 'export' | 'migrate' | 'delete' | 'update';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  itemCount: number;
  processedCount: number;
  errorCount: number;
  startedAt: Date;
  completedAt?: Date;
  errors?: BulkOperationError[];
}

export interface BulkOperationError {
  itemId: string;
  error: string;
  lineNumber?: number;
}

// ============= SYNC SCHEMAS =============

export interface SyncData {
  timestamp: Date;
  entityType: string;
  operation: 'create' | 'update' | 'delete';
  entityId: string;
  changes: Record<string, unknown>;
  userId: string;
}

export interface SyncState {
  lastSyncedAt: Date;
  pendingChanges: SyncData[];
  syncStatus: 'synced' | 'syncing' | 'pending' | 'error';
}
