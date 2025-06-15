
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

// Add businessHours and location/map fields to interface
interface CompanyInfo {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  logoUrl: string;
  footer: string;
  terms: string;
  businessHours: string;
  mapEmbedUrl?: string;
  mapDisplayText?: string;
  locationDescription?: string;
  directions?: string;
  invoiceColors: {
    primary: string;
    accent: string;
    text: string;
  };
}

const defaultCompanyInfo: CompanyInfo = {
  name: "SHREERAM MARKETING",
  tagline: "Premium Paints & Coatings Dealer",
  address: "[Your Address Here]",
  phone: "[Your Phone]",
  email: "[Your Email]",
  gstin: "[Your GSTIN Number]",
  logoUrl: "",
  footer: "Thank you for your business!\nVisit us again for all your paint needs.",
  terms: "This is a computer generated invoice and does not require signature.\nTerms & Conditions: Payment due within 30 days. All disputes subject to local jurisdiction.",
  businessHours: "Monday - Saturday: 9:00 AM - 7:00 PM\nSunday: 10:00 AM - 5:00 PM",
  mapEmbedUrl: "",
  mapDisplayText: "Google Maps Integration",
  locationDescription: "123 Paint Street, Mumbai",
  directions: "Located near Landmark Mall, parking available beside the showroom.",
  invoiceColors: {
    primary: "#1e3a8a", // blue
    accent: "#dc2626", // red
    text: "#333",
  },
};

interface CompanyInfoContextType {
  companyInfo: CompanyInfo;
  updateCompanyInfo: (info: Partial<CompanyInfo>) => void;
}

const CompanyInfoContext = createContext<CompanyInfoContextType>({
  companyInfo: defaultCompanyInfo,
  updateCompanyInfo: () => {},
});

export function useCompanyInfo() {
  return useContext(CompanyInfoContext);
}

export function CompanyInfoProvider({ children }: { children: ReactNode }) {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => {
    const saved = localStorage.getItem("company_info");
    return saved ? JSON.parse(saved) : defaultCompanyInfo;
  });

  useEffect(() => {
    localStorage.setItem("company_info", JSON.stringify(companyInfo));
  }, [companyInfo]);

  const updateCompanyInfo = (info: Partial<CompanyInfo>) => {
    setCompanyInfo((prev) => ({ ...prev, ...info }));
  };

  return (
    <CompanyInfoContext.Provider value={{ companyInfo, updateCompanyInfo }}>
      {children}
    </CompanyInfoContext.Provider>
  );
}
