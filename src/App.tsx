import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Billing from "./pages/Billing";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import { CompanyInfoProvider } from "./contexts/CompanyInfoContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { SupabaseAuthProvider } from "./contexts/SupabaseAuthContext";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <CompanyInfoProvider>
              <SupabaseAuthProvider>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/contact" element={<Contact />} />
                    {/* Redirect calls to /admin-login to /auth, handled in AdminLogin page */}
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/admin" element={
                      <ProtectedRoute>
                        <Admin />
                      </ProtectedRoute>
                    } />
                    <Route path="/inventory" element={
                      <ProtectedRoute>
                        <Inventory />
                      </ProtectedRoute>
                    } />
                    <Route path="/billing" element={
                      <ProtectedRoute>
                        <Billing />
                      </ProtectedRoute>
                    } />
                    <Route path="/reports" element={
                      <ProtectedRoute>
                        <Reports />
                      </ProtectedRoute>
                    } />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </SupabaseAuthProvider>
            </CompanyInfoProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
