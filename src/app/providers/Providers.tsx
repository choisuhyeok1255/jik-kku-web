import React from "react";

import AuthProvider from "./AuthProvider";
import PrefetchDataProvider from "./PrefetchDataProvider";
import QueryProvider from "./QueryProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <PrefetchDataProvider>
        <AuthProvider>{children}</AuthProvider>
      </PrefetchDataProvider>
    </QueryProvider>
  );
};

export default Providers;
