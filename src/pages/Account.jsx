import React from "react";
import { useAuth } from "@/lib/AuthContext";
import AccountPortal from "@/components/account/AccountPortal";
import AccountDashboard from "@/components/account/AccountDashboard";

export default function Account() {
  const { isAuthenticated, isLoadingAuth, user } = useAuth();

  return (
    <div className="bg-background pt-20 min-h-screen">
      {isLoadingAuth ? (
        <div className="flex items-center justify-center py-40">
          <div className="w-8 h-8 border-4 border-border border-t-foreground rounded-full animate-spin" />
        </div>
      ) : isAuthenticated && user ? (
        <AccountDashboard user={user} />
      ) : (
        <AccountPortal />
      )}
    </div>
  );
}