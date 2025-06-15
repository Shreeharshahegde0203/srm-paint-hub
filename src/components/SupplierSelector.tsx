
import React from "react";
import EnhancedSupplierSelector from "./EnhancedSupplierSelector";

interface SupplierSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

const SupplierSelector: React.FC<SupplierSelectorProps> = ({ value, onChange }) => {
  return <EnhancedSupplierSelector value={value} onChange={onChange} />;
};

export default SupplierSelector;
