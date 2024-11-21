import React, { useState, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import VerifyEmailPage from "./pages/auth/signup/VerifyEmailPage";
import ForgotPasswordPage from "./pages/auth/forgotPassword/forgotPasswordPage";
import ResetPasswordPage from "./pages/auth/forgotPassword/resetPasswordPage";
import Navbar from "./components/common/Navbar";
import CategoriesPanel from "./components/common/CategoriesPanel";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { CategoryProvider } from "./context/CategoryContext";

function App() {
  const location = useLocation();
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const isAuthPage = [
    "/login",
    "/signup",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
  ].includes(location.pathname);

  return (
    <CategoryProvider>
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto min-h-screen">
        <div
          className={`flex flex-col ${isAuthPage ? "" : "border-r border-gray-700"} ${
            isMobile ? "" : "sticky top-0 h-screen"
          }`}
        >
        </div>
        <div className="flex flex-col w-full ">
          {authUser && <Navbar />}
          <div className="flex-grow">
            <Routes>
              <Route
                path="/"
                element={authUser ? <HomePage /> : <Navigate to="/login" />}
              />
              <Route
                path="/login"
                element={!authUser ? <LoginPage /> : <Navigate to="/" />}
              />
              <Route
                path="/signup"
                element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
              />
              <Route
                path="/verify-email"
                element={!authUser ? <VerifyEmailPage /> : <Navigate to="/" />}
              />
              <Route
                path="/forgot-password"
                element={
                  !authUser ? <ForgotPasswordPage /> : <Navigate to="/" />
                }
              />
              <Route
                path="/reset-password/:token"
                element={
                  !authUser ? <ResetPasswordPage /> : <Navigate to="/" />
                }
              />
            </Routes>
          </div>
        </div>
        <div
          className={`flex-grow ${
            isAuthPage ? "" : "border-l border-gray-700"
          } ${isMobile ? "" : "sticky top-0 h-screen"}`}
        >
          {authUser && location.pathname === "/" && <CategoriesPanel />}
        </div>
        <Toaster />
      </div>
    </CategoryProvider>
  );
}

export default App;