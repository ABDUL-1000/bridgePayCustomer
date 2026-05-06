// ─── Page routing ────────────────────────────────────────────────────────────

export type OnboardingPageType =
  | "signIn"
  | "signUp"
  | "useCaseSelection"
  | "forgotPassword"
  | "bvnVerification";

// ─── Sign-up multi-step tabs ─────────────────────────────────────────────────

export type SignupTabType =
  | "stepOne"           // Email / phone entry
  | "stepTwo"           // Email OTP verification
  | "stepThree"         // ID details (NIN / BVN + DOB)
  | "stepFourIdentityOtp" // Identity OTP verification
  | "stepFour"          // Identity preview / confirmation
  | "stepFive"          // Password setup
  | "stepSix";          // PIN creation

/** @deprecated Use SignupTabType */
export type TabType = SignupTabType;

// ─── Forgot-password multi-step tabs ─────────────────────────────────────────

export type ForgotPasswordTabType =
  | "forgotOne"   // Email entry
  | "forgotTwo"   // OTP verification
  | "forgotThree"; // New password

// ─── BVN verification tabs ───────────────────────────────────────────────────

export type BVNVerificationTabType =
  | "bvnOne"   // BVN entry
  | "bvnTwo";  // BVN OTP verification

// ─── Sign-in steps ───────────────────────────────────────────────────────────

export type SignInStepType =
  | "identifier"  // Email / phone check
  | "password";   // Password entry

// ─── Use-case selection ──────────────────────────────────────────────────────

export type UsagePurpose =
  | "PAY_ONLINE"
  | "VIRTUAL_CARD"
  | "SCHOOL_FEES"
  | "IMPORT_GOODS"
  | "SAVE_FOREIGN_CURRENCY";

export type ReferralSource =
  | "REFERRAL"
  | "SOCIAL_MEDIA"
  | "OTHERS";
