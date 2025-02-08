"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function VerifyPasswordPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserPassword = async () => {
    try {
      const res = await axios.post("/api/users/verifyreset", { token });
      setUser({ ...user, email: res.data.userEmail });
      setVerified(true);
    } catch (error: any) {
      setError(true);
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    if (token.length > 0) {
      verifyUserPassword();
    }
  }, [token]);

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onReset = async () => {
    try {
      if (user.password !== user.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      setLoading(true);
      const response = await axios.post("/api/users/resetpassword", user);
      console.log("password reset successful", response.data);
      toast.success("password reset successful");
      router.push("/login");
    } catch (error: any) {
      toast.error("password reset failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Toaster position="top-center" reverseOrder={false} />
      {verified && (
        <>
          <h1>{loading ? "Processing" : "Set New Password"}</h1>
          <hr />
          <label htmlFor="password">Password</label>
          <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            type="password"
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="password"
          />
          <label htmlFor="confirmpassword">Confirm Password</label>
          <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            type="password"
            id="confirmpassword"
            value={user.confirmPassword}
            onChange={(e) =>
              setUser({ ...user, confirmPassword: e.target.value })
            }
            placeholder="password"
          />
          <button
            onClick={onReset}
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
          >
            {buttonDisabled ? "No changes" : "Reset Password"}
          </button>
        </>
      )}
      {error && (
        <div>
          <h2 className="text-2xl bg-red-500 text-black">Invalid Token</h2>
        </div>
      )}
    </div>
  );
}
