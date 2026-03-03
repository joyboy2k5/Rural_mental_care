import { Language } from '@/contexts/LanguageContext';

export interface PatientProfile {
    id: string; // Date.now().toString()
    name: string;
    language: Language;
    age: number;
    gender: 'male' | 'female' | 'other';
    district: string;
    village: string;
    // TODO: hash password before production
    password: string;
    createdAt: string; // ISO date
}

const STORAGE_KEY = 'manovaidya_patient_profile';

export const savePatientProfile = (profile: PatientProfile): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
};

export const getPatientProfile = (): PatientProfile | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
        return JSON.parse(stored) as PatientProfile;
    } catch {
        return null;
    }
};

export const clearPatientProfile = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
    }
};

export const isPatientLoggedIn = (): boolean => {
    return getPatientProfile() !== null;
};

export const validatePassword = (inputPassword: string): boolean => {
    const profile = getPatientProfile();
    if (!profile) return false;
    return profile.password === inputPassword;
};

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
