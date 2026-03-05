import { Language } from '@/contexts/LanguageContext';

export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  language: Language;
  age: number;
  gender: 'male' | 'female' | 'other';
  district: string;
  village: string;
  password?: string; // Optional for guests
  createdAt: string;
  isGuest?: boolean; // Flag to identify guest sessions
}

const PROFILE_KEY = 'manovaidya_patient_profile';
const GUEST_KEY = 'manovaidya_guest_session';

/**
 * Saves a registered patient profile to localStorage
 */
export const savePatientProfile = (profile: PatientProfile): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }
};

/**
 * Retrieves the stored patient profile or guest session
 */
export const getPatientProfile = (): PatientProfile | null => {
  if (typeof window === 'undefined') return null;

  const storedProfile = localStorage.getItem(PROFILE_KEY);
  if (storedProfile) {
    try {
      return JSON.parse(storedProfile) as PatientProfile;
    } catch {
      return null;
    }
  }

  // Fallback check for guest session in sessionStorage
  const storedGuest = sessionStorage.getItem("manovaidya_session");
  if (storedGuest) {
    try {
      return JSON.parse(storedGuest) as PatientProfile;
    } catch {
      return null;
    }
  }

  return null;
};

/**
 * Creates a temporary guest session
 */
export const startGuestSession = (): void => {
  if (typeof window !== 'undefined') {
    const guestData = {
      role: "patient",
      isGuest: true,
      loginTime: Date.now(),
      name: "Guest User",
      createdAt: new Date().toISOString()
    };
    sessionStorage.setItem("manovaidya_session", JSON.stringify(guestData));
  }
};

/**
 * Clears all authentication data
 */
export const clearPatientProfile = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(PROFILE_KEY);
    sessionStorage.removeItem("manovaidya_session"); // Clear the session storage as well
  }
};

/**
 * Checks if a user is logged in (either as a registered patient or guest)
 */
export const isPatientLoggedIn = (): boolean => {
  return getPatientProfile() !== null;
};

/**
 * Validates password for registered users
 */
export const validatePassword = (inputPassword: string): boolean => {
  const profile = getPatientProfile();
  if (!profile || profile.isGuest) return false;
  return profile.password === inputPassword;
};

/* ---------------- TELANGANA DISTRICTS ---------------- */

export const TELANGANA_DISTRICTS: Record<string, string[]> = {
  "Adilabad": ["Adilabad", "Boath", "Utnoor", "Ichoda", "Jainad"],
  "Bhadradri Kothagudem": ["Kothagudem", "Palwancha", "Bhadrachalam", "Manuguru", "Yellandu"],
  "Hanumakonda": ["Hanumakonda", "Kazipet", "Hasanparthy", "Parkal", "Kamalapur"],
  "Hyderabad": ["Ameerpet", "Khairatabad", "Secunderabad", "Charminar", "Golconda"],
  "Jagtial": ["Jagtial", "Korutla", "Metpalli", "Raikal", "Dharmapuri"],
  "Jangaon": ["Jangaon", "Palakurthi", "Devaruppula", "Bachannapet", "Ghanpur"],
  "Jayashankar Bhupalpally": ["Bhupalpally", "Kataram", "Mahadevpur", "Malhar Rao", "Mutharam"],
  "Jogulamba Gadwal": ["Gadwal", "Alampur", "Ieeja", "Itikyal", "Maldakal"],
  "Kamareddy": ["Kamareddy", "Banswada", "Yellareddy", "Biknur", "Domakonda"],
  "Karimnagar": ["Karimnagar", "Choppadandi", "Huzurabad", "Jammikunta", "Manakondur"],
  "Khammam": ["Khammam", "Madhira", "Sathupalli", "Wyra", "Tallada"],
  "Kumuram Bheem": ["Asifabad", "Kagaznagar", "Sirpur", "Rebbena", "Kouthala"],
  "Mahabubabad": ["Mahabubabad", "Dornakal", "Kuravi", "Maripeda", "Thorur"],
  "Mahabubnagar": ["Mahabubnagar", "Jadcherla", "Devarkadra", "Makthal", "Narayanpet"],
  "Mancherial": ["Mancherial", "Bellampalli", "Chennur", "Mandamarri", "Luxettipet"],
  "Medak": ["Medak", "Narsapur", "Papannapet", "Ramayampet", "Shankarampet"],
  "Medchal-Malkajgiri": ["Medchal", "Malkajgiri", "Keesara", "Ghatkesar", "Uppal"],
  "Mulugu": ["Mulugu", "Venkatapur", "Govindaraopet", "Tadvai", "Eturnagaram"],
  "Nagarkurnool": ["Nagarkurnool", "Achampet", "Kollapur", "Kalwakurthy", "Telkapally"],
  "Nalgonda": ["Nalgonda", "Miryalaguda", "Devarakonda", "Nakrekal", "Munugode"],
  "Narayanpet": ["Narayanpet", "Makthal", "Maddur", "Damaragidda", "Danwada"],
  "Nirmal": ["Nirmal", "Bhainsa", "Khanapur", "Kaddampeddur", "Mamda"],
  "Nizamabad": ["Nizamabad", "Armoor", "Bodhan", "Bheemgal", "Dichpally"],
  "Peddapalli": ["Peddapalli", "Ramagundam", "Manthani", "Sulthanabad", "Odela"],
  "Rajanna Sircilla": ["Sircilla", "Vemulawada", "Chandurthi", "Ellanthakunta", "Gambhiraopet"],
  "Rangareddy": ["Shamshabad", "Ibrahimpatnam", "Maheshwaram", "Rajendranagar", "Serilingampally"],
  "Sangareddy": ["Sangareddy", "Zahirabad", "Narayankhed", "Andole", "Patancheru"],
  "Siddipet": ["Siddipet", "Gajwel", "Husnabad", "Dubbak", "Cherial"],
  "Suryapet": ["Suryapet", "Kodad", "Huzurnagar", "Tungaturthi", "Neredcherla"],
  "Vikarabad": ["Vikarabad", "Tandur", "Pargi", "Kodangal", "Marpalle"],
  "Wanaparthy": ["Wanaparthy", "Pebbair", "Kothakota", "Amarchinta", "Atmakur"],
  "Warangal": ["Narsampet", "Wardhannapet", "Rayaparthy", "Parvathagiri", "Geesugonda"],
  "Yadadri Bhuvanagiri": ["Bhongir", "Choutuppal", "Alair", "Mothkur", "Ramannapet"]
};