import React from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminCheck } from "@/hooks/use-admin-check";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

export const AdminButton = () => {
  const { isAdmin, isLoading } = useAdminCheck();

  if (isLoading) {
    return (
      <Button variant="outline" className="rounded-full" disabled>
        <LoadingIndicator size="sm" />
      </Button>
    );
  }

  if (!isAdmin) return null;

  return (
    <Link to="/admin">
      <Button variant="outline" className="rounded-full hover:shadow-md transition-all duration-300">
        <Settings className="mr-2 h-4 w-4" /> Administration
      </Button>
    </Link>
  );
};