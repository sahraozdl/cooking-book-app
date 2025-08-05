"use client";

import { UserProvider } from "@/store/UserContext";
import AppWrapper from "./AppWrapper";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <UserProvider>
    <AppWrapper>
     
    {children}
   
    </AppWrapper>
    </UserProvider>;
};

export default Providers;
