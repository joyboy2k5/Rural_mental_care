import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronRight, ChevronLeft, Loader2, ArrowLeft, UserCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import { TELANGANA_DISTRICTS } from "@/lib/patientAuth";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Added getDoc

const containerVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

export default function PatientAuth() {
    const { language } = useLanguage();
    const navigate = useNavigate();

    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);

    // Sign In States
    const [signInEmail, setSignInEmail] = useState("");
    const [signInPassword, setSignInPassword] = useState("");
    const [signInError, setSignInError] = useState("");

    // Sign Up States
    const [signUpName, setSignUpName] = useState("");
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpAge, setSignUpAge] = useState<number | "">("");
    const [signUpGender, setSignUpGender] = useState<"male" | "female" | "other" | "">("");
    const [signUpDistrict, setSignUpDistrict] = useState("");
    const [signUpVillage, setSignUpVillage] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
    const [signUpError, setSignUpError] = useState("");

    const sortedDistricts = TELANGANA_DISTRICTS ? Object.keys(TELANGANA_DISTRICTS).sort() : [];
    const currentVillages = signUpDistrict && TELANGANA_DISTRICTS[signUpDistrict]
        ? TELANGANA_DISTRICTS[signUpDistrict]
        : [];

    // --- Logic Handlers ---

    const handleGuestLogin = () => {
        const guestSession = {
            role: "patient",
            isGuest: true,
            name: "Guest User",
            loginTime: Date.now()
        };
        sessionStorage.setItem("manovaidya_session", JSON.stringify(guestSession));
        navigate("/patient/triage");
    };

    const handleSignIn = async () => {
        setSignInError("");
        if (!signInEmail || !signInPassword) {
            setSignInError("Please fill all fields");
            return;
        }

        try {
            setIsLoading(true);
            const userCredential = await signInWithEmailAndPassword(auth, signInEmail, signInPassword);

            // FETCH DATA FROM FIRESTORE (Added functionality)
            const userDoc = await getDoc(doc(db, "patients", userCredential.user.uid));

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const session = {
                    id: userCredential.user.uid,
                    ...userData,
                    role: "patient",
                    loginTime: Date.now()
                };
                sessionStorage.setItem("manovaidya_session", JSON.stringify(session));
                navigate("/patient/triage");
            } else {
                setSignInError("User data not found. Please Sign Up.");
            }
        } catch (err: any) {
            setSignInError("Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUpNext = () => {
        setSignUpError("");
        if (step === 1) {
            if (signUpName.length < 2) return setSignUpError("Name too short");
            if (!signUpEmail.includes("@")) return setSignUpError("Enter valid email");
            if (signUpAge === "" || signUpAge < 5 || signUpAge > 110) return setSignUpError("Invalid age");
            setStep(2);
        } else if (step === 2) {
            if (!signUpGender) return setSignUpError("Select gender");
            setStep(3);
        }
    };

    const handleSignUpSubmit = async () => {
        setSignUpError("");
        if (!signUpDistrict || !signUpVillage) return setSignUpError("Select district and village");
        if (signUpPassword !== signUpConfirmPassword) return setSignUpError("Passwords do not match");

        try {
            setIsLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
            const patientData = {
                name: signUpName,
                email: signUpEmail,
                age: signUpAge,
                gender: signUpGender,
                district: signUpDistrict,
                village: signUpVillage,
                language: language,
                createdAt: new Date().toISOString()
            };

            await setDoc(doc(db, "patients", userCredential.user.uid), patientData);

            // UPDATE SESSION STORAGE (Added functionality)
            sessionStorage.setItem("manovaidya_session", JSON.stringify({
                id: userCredential.user.uid,
                ...patientData,
                role: "patient"
            }));

            navigate("/patient/triage");
        } catch (error: any) {
            setSignUpError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-4">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm mb-2"
                >
                    <ArrowLeft size={16} /> Back to Home
                </button>

                <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Heart className="text-primary" />
                        <h1 className="font-bold text-lg">ManoVaidya</h1>
                    </div>

                    <div className="flex border-b mb-6">
                        <button
                            className={`flex-1 py-3 transition-colors ${mode === "signin" ? "border-b-2 border-primary font-semibold" : "text-muted-foreground"}`}
                            onClick={() => setMode("signin")}
                        >
                            Sign In
                        </button>
                        <button
                            className={`flex-1 py-3 transition-colors ${mode === "signup" ? "border-b-2 border-primary font-semibold" : "text-muted-foreground"}`}
                            onClick={() => setMode("signup")}
                        >
                            Sign Up
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {mode === "signin" ? (
                            <motion.div key="signin" variants={containerVariant} initial="hidden" animate="show" exit="exit" className="space-y-4">
                                <input placeholder="Email" value={signInEmail} onChange={(e) => setSignInEmail(e.target.value)} className="input" />
                                <input type="password" placeholder="Password" value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} className="input" />
                                {signInError && <p className="text-red-500 text-xs">{signInError}</p>}
                                <button onClick={handleSignIn} disabled={isLoading} className="btn-primary w-full">
                                    {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "Sign In"}
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div key="signup" variants={containerVariant} initial="hidden" animate="show" exit="exit" className="space-y-5">
                                {step === 1 && (
                                    <div className="space-y-4">
                                        <input placeholder="Full Name" value={signUpName} onChange={(e) => setSignUpName(e.target.value)} className="input" />
                                        <input placeholder="Email" value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} className="input" />
                                        <LanguageSelector />
                                        <input type="number" placeholder="Age" value={signUpAge} onChange={(e) => setSignUpAge(e.target.value === "" ? "" : Number(e.target.value))} className="input" />
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-3">
                                        {["male", "female", "other"].map((g) => (
                                            <button key={g} onClick={() => setSignUpGender(g as any)} className={`btn-outline w-full ${signUpGender === g ? 'bg-primary/10 border-primary' : ''}`}>
                                                <span className="capitalize">{g}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-4">
                                        <select value={signUpDistrict} onChange={(e) => setSignUpDistrict(e.target.value)} className="input">
                                            <option value="">Select district</option>
                                            {sortedDistricts.map((d) => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                        <select value={signUpVillage} onChange={(e) => setSignUpVillage(e.target.value)} className="input">
                                            <option value="">Select village</option>
                                            {currentVillages.map((v) => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                        <input type="password" placeholder="Password" value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} className="input" />
                                        <input type="password" placeholder="Confirm Password" value={signUpConfirmPassword} onChange={(e) => setSignUpConfirmPassword(e.target.value)} className="input" />
                                    </div>
                                )}

                                {signUpError && <p className="text-red-500 text-xs">{signUpError}</p>}

                                <div className="flex gap-3">
                                    {step > 1 && <button onClick={() => setStep(step - 1)} className="btn-outline"><ChevronLeft /></button>}
                                    {step < 3 ? (
                                        <button onClick={handleSignUpNext} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                            Next <ChevronRight className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button onClick={handleSignUpSubmit} disabled={isLoading} className="btn-primary flex-1">
                                            {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "Create Account"}
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-8 pt-6 border-t border-dashed border-border">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted/30"></span></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
                        </div>

                        <button
                            onClick={handleGuestLogin}
                            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all text-primary font-medium"
                        >
                            <UserCircle size={18} />
                            Continue as Guest
                        </button>
                        <p className="text-[10px] text-center text-muted-foreground mt-2">
                            Guest progress may not be saved across sessions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}