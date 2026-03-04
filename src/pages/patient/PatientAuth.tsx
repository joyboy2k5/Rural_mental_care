import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import { TELANGANA_DISTRICTS } from "@/lib/patientAuth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";



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

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInError, setSignInError] = useState("");

  const [step, setStep] = useState(1);

  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpAge, setSignUpAge] = useState<number | "">("");
  const [signUpGender, setSignUpGender] = useState<"male" | "female" | "other" | "">("");
  const [signUpDistrict, setSignUpDistrict] = useState("");
  const [signUpVillage, setSignUpVillage] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [signUpError, setSignUpError] = useState("");

  // FIX: Safe fallback for districts and villages to prevent .map() crashes
  const sortedDistricts = TELANGANA_DISTRICTS ? Object.keys(TELANGANA_DISTRICTS).sort() : [];
  const currentVillages = signUpDistrict && TELANGANA_DISTRICTS[signUpDistrict]
    ? TELANGANA_DISTRICTS[signUpDistrict]
    : [];

  const handleSignIn = async () => {
    setSignInError("");

    if (!signInEmail || !signInPassword) {
      setSignInError("Please fill all fields");
      return;
    }

    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, signInEmail, signInPassword);
      navigate("/patient/triage");
    } catch {
      setSignInError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpNext = () => {
    setSignUpError("");

    if (step === 1) {
      if (signUpName.length < 2) {
        setSignUpError("Name too short");
        return;
      }
      if (!signUpEmail.includes("@")) {
        setSignUpError("Enter valid email");
        return;
      }
      if (signUpAge === "" || signUpAge < 5 || signUpAge > 110) {
        setSignUpError("Invalid age");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!signUpGender) {
        setSignUpError("Select gender");
        return;
      }
      setStep(3);
    }
  };

 const handleSignUpSubmit = async () => {
  setSignUpError("");

  if (!signUpDistrict || !signUpVillage) {
    setSignUpError("Please select a district and village");
    return;
  }

  if (signUpPassword !== signUpConfirmPassword) {
    setSignUpError("Passwords do not match");
    return;
  }

  try {
    setIsLoading(true);

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      signUpEmail,
      signUpPassword
    );

    const user = userCredential.user;

    // 🔥 Save patient profile to Firestore
    await setDoc(doc(db, "patients", user.uid), {
      name: signUpName,
      email: signUpEmail,
      age: signUpAge,
      gender: signUpGender,
      district: signUpDistrict,
      village: signUpVillage,
      language: language,
      createdAt: new Date()
    });

    navigate("/patient/triage");

  } catch (error: any) {
    setSignUpError(error.message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6 glass-card">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="text-primary" />
          <h1 className="font-bold text-lg">ManoVaidya</h1>
        </div>

        <div className="flex border-b mb-6">
          <button
            className={`flex-1 py-3 ${mode === "signin" ? "border-b-2 border-primary" : ""}`}
            onClick={() => setMode("signin")}
          >
            Sign In
          </button>

          <button
            className={`flex-1 py-3 ${mode === "signup" ? "border-b-2 border-primary" : ""}`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === "signin" && (
            <motion.div
              key="signin"
              variants={containerVariant}
              initial="hidden"
              animate="show"
              exit="exit"
              className="space-y-4"
            >
              <input
                placeholder="Email"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                className="input"
              />

              <input
                type="password"
                placeholder="Password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                className="input"
              />

              {signInError && (
                <p className="text-red-500 text-sm">{signInError}</p>
              )}

              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "Sign In"}
              </button>
            </motion.div>
          )}

          {mode === "signup" && (
            <motion.div
              key="signup"
              variants={containerVariant}
              initial="hidden"
              animate="show"
              exit="exit"
              className="space-y-5"
            >
              {step === 1 && (
                <div className="space-y-4">
                  <input
                    placeholder="Full Name"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="input"
                  />

                  <input
                    placeholder="Email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="input"
                  />

                  <LanguageSelector />

                  <input
                    type="number"
                    placeholder="Age"
                    value={signUpAge}
                    onChange={(e) =>
                      setSignUpAge(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="input"
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  {["male", "female", "other"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSignUpGender(g as any)}
                      className={`btn-outline w-full ${signUpGender === g ? 'bg-primary/10 border-primary' : ''}`}
                    >
                      <span className="capitalize">{g}</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <select
                    value={signUpDistrict}
                    onChange={(e) => setSignUpDistrict(e.target.value)}
                    className="input"
                  >
                    <option value="">Select district</option>
                    {sortedDistricts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>

                  <select
                    value={signUpVillage}
                    onChange={(e) => setSignUpVillage(e.target.value)}
                    className="input"
                  >
                    <option value="">Select village</option>
                    {currentVillages.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>

                  <input
                    type="password"
                    placeholder="Password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="input"
                  />

                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    className="input"
                  />
                </div>
              )}

              {signUpError && (
                <p className="text-red-500 text-sm">{signUpError}</p>
              )}

              <div className="flex gap-3">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="btn-outline"
                  >
                    <ChevronLeft />
                  </button>
                )}

                {step < 3 ? (
                  <button
                    onClick={handleSignUpNext}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSignUpSubmit}
                    disabled={isLoading}
                    className="btn-primary flex-1 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "Create Account"}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}