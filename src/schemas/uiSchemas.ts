/**
 * UI Component and Data Schemas for Sense Aid Portal
 */

import React from 'react';

export interface ComponentProps {
  className?: string;
  id?: string;
  ariaLabel?: string;
  role?: string;
}

// ============= NAVIGATION SCHEMAS =============

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  description?: string;
  accessibilityLabel?: string;
}

export interface NavigationConfig {
  logo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  items: NavItem[];
  settings: {
    showThemeToggle: boolean;
    showAccessibilityPanel: boolean;
    showUserMenu: boolean;
  };
}

// ============= CARD SCHEMAS =============

export interface CardProps extends ComponentProps {
  title: string;
  description?: string;
  icon?: string | React.ComponentType<{ className?: string; size?: number }>;
  image?: string;
  link?: string;
  onClick?: () => void;
  variant?: 'default' | 'highlight' | 'minimal';
  disabled?: boolean;
}

export interface DisabilityCard extends CardProps {
  disabilityType: 'blind' | 'mute' | 'deaf';
  statistics?: {
    label: string;
    value: string | number;
  }[];
}

export interface ServiceCard extends CardProps {
  serviceId: string;
  category: string;
  availability: 'always' | 'on_request' | 'limited';
  contactInfo?: string;
}

// ============= BUTTON SCHEMAS =============

export interface ButtonProps extends ComponentProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface CTAButton extends ButtonProps {
  action: 'signup' | 'login' | 'learn_more' | 'contact' | 'explore';
  tracking?: {
    eventName: string;
    eventData: Record<string, unknown>;
  };
}

// ============= FORM SCHEMAS =============

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
  placeholder?: string;
  required: boolean;
  validation?: FormValidation;
  errorMessage?: string;
  helpText?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export interface FormValidation {
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  customValidator?: (value: string) => boolean;
  errorMessage: string;
}

export interface FormConfig {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  submitButton: {
    label: string;
    variant: 'primary' | 'secondary';
  };
  cancelButton?: {
    label: string;
    href: string;
  };
  onSubmit: (data: FormData) => Promise<void>;
}

export type FormData = Record<string, string | number | boolean | File>;

// ============= HERO SECTION SCHEMAS =============

export interface HeroSectionProps extends ComponentProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  ctaButton: CTAButton;
  secondaryButton?: CTAButton;
  overlay?: {
    color: string;
    opacity: number;
  };
  alignment?: 'left' | 'center' | 'right';
  minHeight?: string;
  accessibilityDescription?: string;
}

// ============= FOOTER SCHEMAS =============

export interface FooterColumn {
  title: string;
  links: {
    label: string;
    href: string;
    icon?: string;
  }[];
}

export interface FooterConfig {
  columns: FooterColumn[];
  bottomSection: {
    copyright: string;
    legalLinks: {
      label: string;
      href: string;
    }[];
  };
  socialLinks: {
    platform: string;
    url: string;
    icon: string;
  }[];
}

// ============= MODAL SCHEMAS =============

export interface ModalConfig {
  id: string;
  title: string;
  content: string | React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
  buttons: {
    label: string;
    variant: 'primary' | 'secondary' | 'danger';
    onClick: () => void;
  }[];
  onClose: () => void;
  backdrop?: boolean;
  closeButton?: boolean;
  accessibilityRole?: 'dialog' | 'alertdialog';
}

// ============= GALLERY/CAROUSEL SCHEMAS =============

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  caption?: string;
}

export interface CarouselConfig {
  items: GalleryItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showThumbnails?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  loop?: boolean;
  ariaLabel: string;
}

// ============= TESTIMONIAL SCHEMAS =============

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  disabilityType: 'blind' | 'mute' | 'deaf' | 'general';
  content: string;
  rating?: number;
  image?: string;
  date: Date;
}

export interface TestimonialsSectionConfig {
  title: string;
  subtitle?: string;
  testimonials: Testimonial[];
  displayFormat?: 'carousel' | 'grid' | 'list';
}

// ============= STATS SCHEMAS =============

export interface Stat {
  id: string;
  label: string;
  value: string | number;
  icon?: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
}

export interface StatsSection {
  id: string;
  title: string;
  description?: string;
  stats: Stat[];
  layout?: 'grid' | 'row';
}

// ============= ACCESSIBILITY COMPONENT SCHEMAS =============

export interface AccessibilitySettings {
  fontSize: 'small' | 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  reducedMotion: boolean;
}

export interface AccessibilityFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'visual' | 'audio' | 'motor' | 'cognitive';
  enabled: boolean;
  settings?: Partial<AccessibilitySettings>;
}

export interface AccessibilityComponentConfig {
  features: AccessibilityFeature[];
  layout?: 'vertical' | 'horizontal' | 'grid';
  closeOnSelect?: boolean;
}

// ============= FEATURE SHOWCASE SCHEMAS =============

export interface FeatureShowcase {
  id: string;
  title: string;
  description: string;
  image?: string;
  icon?: string;
  benefits: string[];
  cta?: {
    label: string;
    href: string;
  };
}

export interface FeatureShowcaseSection {
  title: string;
  subtitle?: string;
  features: FeatureShowcase[];
  layout?: 'grid' | 'carousel' | 'timeline';
}
