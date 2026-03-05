import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; 
import { Heart, ChevronLeft, Loader2, ArrowLeft, Fingerprint } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import { TELANGANA_DISTRICTS, validateAbhaId } from "@/lib/patientAuth";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

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

    const [signInEmail, setSignInEmail] = useState("");
    const [signInPassword, setSignInPassword] = useState("");
    const [signInError, setSignInError] = useState("");

    const [signUpName, setSignUpName] = useState("");
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpAbhaId, setSignUpAbhaId] = useState("");
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

    // FIX: Modified to return the credential ID instead of writing to Firestore directly
    const handleRegisterBiometric = async (userId: string) => {
        if (!window.PublicKeyCredential) return null;
        try {
            const credential = await navigator.credentials.create({
                publicKey: {
                    challenge: crypto.getRandomValues(new Uint8Array(32)),
                    rp: { name: "ManoVaidya" },
                    user: {
                        id: new TextEncoder().encode(userId),
                        name: signUpEmail,
                        displayName: signUpName
                    },
                    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
                    authenticatorSelection: { authenticatorAttachment: "platform" }
                }
            }) as PublicKeyCredential;
            
            if (credential) {
                // Safely convert rawId to base64
                return btoa(Array.from(new Uint8Array(credential.rawId), c => String.fromCharCode(c)).join(''));
            }
        } catch (err) {
            console.error("Biometric registration failed:", err);
            return null; // Return null if user cancels or it fails, so they can still sign up
        }
    };

    const handleBiometricSignIn = async () => {
        setSignInError("");
        if (!signInEmail) {
            setSignInError("Please enter your email first to use fingerprint.");
            return;
        }

        try {
            setIsLoading(true);
            const q = query(collection(db, "patients"), where("email", "==", signInEmail));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setSignInError("No account found with this email.");
                return;
            }

            const userDoc = querySnapshot.docs[0];
            const storedBiometricId = userDoc.data().biometricId;

            if (!storedBiometricId) {
                setSignInError("Fingerprint is not registered for this account.");
                return;
            }

            const assertion = await navigator.credentials.get({
                publicKey: {
                    challenge: crypto.getRandomValues(new Uint8Array(32)),
                    allowCredentials: [{
                        id: Uint8Array.from(atob(storedBiometricId), c => c.charCodeAt(0)),
                        type: 'public-key'
                    }],
                    userVerification: "required"
                }
            });

            if (assertion) {
                sessionStorage.setItem("manovaidya_session", JSON.stringify({
                    id: userDoc.id,
                    ...userDoc.data(),
                    role: "patient",
                    loginTime: Date.now()
                }));
                navigate("/patient/triage"); // Successfully redirects to dashboard
            }
        } catch (err) {
            setSignInError("Fingerprint verification failed or was cancelled.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignIn = async () => {
        setSignInError("");
        if (!signInEmail || !signInPassword) return setSignInError("Please fill all fields");

        try {
            setIsLoading(true);
            const userCredential = await signInWithEmailAndPassword(auth, signInEmail, signInPassword);
            const userDoc = await getDoc(doc(db, "patients", userCredential.user.uid));

            if (userDoc.exists()) {
                sessionStorage.setItem("manovaidya_session", JSON.stringify({
                    id: userCredential.user.uid,
                    ...userDoc.data(),
                    role: "patient",
                    loginTime: Date.now()
                }));
                navigate("/patient/triage");
            }
        } catch (err) {
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
            if (!validateAbhaId(signUpAbhaId)) return setSignUpError("Invalid ABHA ID (14 digits)");
            if (signUpAge === "" || signUpAge < 5 || signUpAge > 110) return setSignUpError("Invalid age");
            setStep(2);
        } else if (step === 2) {
            if (!signUpGender) return setSignUpError("Select gender");
            setStep(3);
        }
    };

    const handleSignUpSubmit = async () => {
        if (!signUpDistrict || !signUpVillage) return setSignUpError("Select district and village");
        if (signUpPassword !== signUpConfirmPassword) return setSignUpError("Passwords do not match");

        try {
            setIsLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
            
            // FIX: Wait for fingerprint registration and capture the ID
            const biometricId = await handleRegisterBiometric(userCredential.user.uid);

            const patientData = {
                name: signUpName,
                email: signUpEmail,
                abhaId: signUpAbhaId,
                age: signUpAge,
                gender: signUpGender,
                district: signUpDistrict,
                village: signUpVillage,
                language: language,
                createdAt: new Date().toISOString(),
                ...(biometricId && { biometricId }) // Safely include biometricId only if registration succeeded
            };

            // FIX: Create the document ONCE with all data including the fingerprint ID
            await setDoc(doc(db, "patients", userCredential.user.uid), patientData);
            
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
                <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm mb-2">
                    <ArrowLeft size={16} /> Back to Home
                </button>

                <div className="glass-card p-6">
                    <div className="flex border-b mb-6">
                        <button className={`flex-1 py-3 transition-colors ${mode === "signin" ? "border-b-2 border-primary font-semibold" : "text-muted-foreground"}`} onClick={() => setMode("signin")}>Sign In</button>
                        <button className={`flex-1 py-3 transition-colors ${mode === "signup" ? "border-b-2 border-primary font-semibold" : "text-muted-foreground"}`} onClick={() => setMode("signup")}>Sign Up</button>
                    </div>

                    <AnimatePresence mode="wait">
                        {mode === "signin" ? (
                            <motion.div key="signin" variants={containerVariant} initial="hidden" animate="show" exit="exit" className="space-y-4">
                                <input placeholder="Email" value={signInEmail} onChange={(e) => setSignInEmail(e.target.value)} className="input" />
                                <input type="password" placeholder="Password" value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} className="input" />
                                {signInError && <p className="text-red-500 text-xs">{signInError}</p>}
                                <button onClick={handleSignIn} disabled={isLoading} className="btn-primary w-full">{isLoading ? <Loader2 className="animate-spin mx-auto" /> : "Sign In"}</button>
                                
                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border"></span></div>
                                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
                                </div>
                                
                                {/* Fingerprint Button */}
                                <button onClick={handleBiometricSignIn} disabled={isLoading} className="w-full flex items-center justify-center gap-2 p-2 border border-primary/20 rounded-lg hover:bg-primary/5 text-primary text-sm font-medium transition-all">
                                    {isLoading ? <Loader2 className="animate-spin mx-auto" /> : <><Fingerprint size={18} /> Use Fingerprint Scanner</>}
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div key="signup" variants={containerVariant} initial="hidden" animate="show" exit="exit" className="space-y-5">
                                {step === 1 && (
                                    <div className="space-y-4">
                                        <input placeholder="Full Name" value={signUpName} onChange={(e) => setSignUpName(e.target.value)} className="input" />
                                        <input placeholder="Email" value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} className="input" />
                                        <input placeholder="ABHA ID (14 digits)" value={signUpAbhaId} onChange={(e) => setSignUpAbhaId(e.target.value)} className="input" />
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
                                        <select value={signUpDistrict} onChange={(e) => { setSignUpDistrict(e.target.value); setSignUpVillage(""); }} className="input">
                                            <option value="">Select district</option>
                                            {sortedDistricts.map((d) => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                        <select value={signUpVillage} onChange={(e) => setSignUpVillage(e.target.value)} className="input" disabled={!signUpDistrict}>
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
                                    <button onClick={step < 3 ? handleSignUpNext : handleSignUpSubmit} disabled={isLoading} className="btn-primary flex-1">
                                        {isLoading ? <Loader2 className="animate-spin mx-auto" /> : step < 3 ? "Next" : "Scan Fingerprint & Register"}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}