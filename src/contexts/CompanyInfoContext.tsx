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
  hsnTemplate?: string;
  showWatermark?: boolean; // New: watermark toggle
  invoiceColorPreset?: "light" | "classic" | "dark" | "custom"; // New: color preset
  // New invoice appearance settings
  bankDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
  };
  declaration: string;
  authorizedSignatory: string;
  stateCode: string;
  stateName: string;
  // Payment and dispatch settings
  paymentTerms: string;
  dispatchThrough: string;
  destination: string;
  deliveryTerms: string;
}

const defaultCompanyInfo: CompanyInfo = {
  name: "SHREERAM MARKETING",
  tagline: "Premium Paints & Coatings Dealer",
  address: "Shreeram Building, Nadigalli, SIRSI-581401 (U.K.)",
  phone: "M: 9448376055",
  email: "shreeram@example.com",
  gstin: "29ABCDE1234F1Z5",
  logoUrl: "",
  footer: "This is a Computer Generated Invoice",
  terms: "Payment due within 30 days. All disputes subject to local jurisdiction.",
  businessHours: "Monday - Saturday: 9:00 AM - 7:00 PM\nSunday: 10:00 AM - 5:00 PM",
  mapEmbedUrl: "",
  mapDisplayText: "Google Maps Integration",
  locationDescription: "Shreeram Building, Nadigalli, SIRSI",
  directions: "Located near Main Market, parking available.",
  invoiceColors: {
    primary: "#1e3a8a",
    accent: "#dc2626",
    text: "#333",
  },
  hsnTemplate: "HSN/SAC codes as per GST guidelines",
  showWatermark: false,
  invoiceColorPreset: "classic",
  bankDetails: {
    bankName: "Karnataka Bank",
    accountNumber: "707200010040901",
    ifscCode: "KARB0000707",
    branch: "Sirsi",
  },
  declaration: "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.",
  authorizedSignatory: "Authorised Signatory",
  stateCode: "29",
  stateName: "Karnataka",
  paymentTerms: "Cash",
  dispatchThrough: "",
  destination: "",
  deliveryTerms: "",
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
