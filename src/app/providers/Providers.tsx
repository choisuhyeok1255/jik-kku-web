import React from "react";

import QueryProvider from "./QueryProvider";
import AuthProvider from "./AuthProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
};

export default Providers;
