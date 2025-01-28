import { FC, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@/components/header/Header";

interface RouteWrapperProps {
  children: ReactNode;
}

export const RouteWrapper: FC<RouteWrapperProps> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Header />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};