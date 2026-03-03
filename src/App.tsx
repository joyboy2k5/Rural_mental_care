import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PatientLayout from "./layouts/PatientLayout";
import PatientTriage from "./pages/patient/PatientTriage";
import PatientAuth from "./pages/patient/PatientAuth";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientRecords from "./pages/patient/PatientRecords";
import PatientSessions from "./pages/patient/PatientSessions";
import PatientResources from "./pages/patient/PatientResources";
import PatientSettings from "./pages/patient/PatientSettings";
import HealthWorkerLayout from "./layouts/HealthWorkerLayout";
import HWAuth from "./pages/healthworker/HWAuth";
import HWDashboard from "./pages/healthworker/HWDashboard";
import HWQueue from "./pages/healthworker/HWQueue";
import HWPatients from "./pages/healthworker/HWPatients";
import HWAnalytics from "./pages/healthworker/HWAnalytics";
import HWResources from "./pages/healthworker/HWResources";
import HWSettings from "./pages/healthworker/HWSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Patient routes */}
            <Route path="/patient/auth" element={<PatientAuth />} />
            <Route path="/patient" element={<PatientLayout />}>
              <Route index element={<Navigate to="/patient/triage" replace />} />
              <Route path="triage" element={<PatientTriage />} />
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="records" element={<PatientRecords />} />
              <Route path="sessions" element={<PatientSessions />} />
              <Route path="resources" element={<PatientResources />} />
              <Route path="settings" element={<PatientSettings />} />
            </Route>

            {/* Healthcare worker routes */}
            <Route path="/healthworker/auth" element={<HWAuth />} />
            <Route path="/healthworker" element={<HealthWorkerLayout />}>
              <Route index element={<Navigate to="/healthworker/dashboard" replace />} />
              <Route path="dashboard" element={<HWDashboard />} />
              <Route path="queue" element={<HWQueue />} />
              <Route path="patients" element={<HWPatients />} />
              <Route path="analytics" element={<HWAnalytics />} />
              <Route path="resources" element={<HWResources />} />
              <Route path="settings" element={<HWSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
