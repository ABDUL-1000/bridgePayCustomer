// ─── User profile response ────────────────────────────────────────────────────

export interface UserAddress {
  street:      string;
  city:        string;
  state:       string;
  country:     string;
  postal_code: string;
  lga:         string;
}

export interface UserProfile {
  id:                string;
  email:             string;
  username:          string | null;
  firstname:         string;
  middlename:        string | null;
  lastname:          string;
  fullname:          string;
  phone:             string;
  address:           UserAddress;
  gender:            string | null;
  employment_status: string | null;
  tier:              number;
  is_verified:       boolean;
  kyc_level:         string;
  created_at:        string;
}
