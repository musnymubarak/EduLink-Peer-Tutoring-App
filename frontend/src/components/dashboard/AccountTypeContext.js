import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const AccountTypeContext = createContext();

// Provider component
export const AccountTypeProvider = ({ children }) => {
  // State to manage the account type
  const [accountType, setAccountType] = useState(() => {
    // Check localStorage for a persisted account type
    return localStorage.getItem("accountType") || "student"; // Default to "student"
  });

  // Persist the account type to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("accountType", accountType);
  }, [accountType]);

  return (
    <AccountTypeContext.Provider value={{ accountType, setAccountType }}>
      {children}
    </AccountTypeContext.Provider>
  );
};

// Hook to use the AccountTypeContext
export const useAccountType = () => {
  const context = useContext(AccountTypeContext);
  if (!context) {
    throw new Error("useAccountType must be used within an AccountTypeProvider");
  }
  return context;
};
