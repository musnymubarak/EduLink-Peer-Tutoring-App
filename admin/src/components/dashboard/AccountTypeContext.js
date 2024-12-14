// AccountTypeContext.js
import React, { createContext, useContext, useState } from "react";

const AccountTypeContext = createContext();

export const AccountTypeProvider = ({ children }) => {
  const [accountType, setAccountType] = useState("student"); // Default value

  return (
    <AccountTypeContext.Provider value={{ accountType, setAccountType }}>
      {children}
    </AccountTypeContext.Provider>
  );
};

export const useAccountType = () => useContext(AccountTypeContext);
