import { signIn, useSession } from "next-auth/react";
import React from "react";

const ProtectedComponent = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  // While loading, show a loading indicator
  if (loading) return <>Loading...</>;

  // If not authenticated, show the login page
  if (!session) {
    signIn("spotify");
    return <></>;
  }

  return <>{children}</>;
};

export default ProtectedComponent;
