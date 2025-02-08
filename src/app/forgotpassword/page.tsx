"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [user, setUser] = React.useState({
    email: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onForgotPassword = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/forgotpassword", user);
      console.log("Email Sent Successfully", response.data);
      toast.success("Email Sent Successfully to " + user.email);
    } catch (error: any) {
      toast.error("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Toaster position="top-center" reverseOrder={false} />
      <h1>{loading ? "Processing" : "Forgot Password"}</h1>
      <hr />

      <label htmlFor="email">Email</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        type="email"
        id="email"
        value={user.email}
        onChange={(e) => setUser({ email: e.target.value })}
        placeholder="email"
      />

      <button
        onClick={onForgotPassword}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
      >
        {buttonDisabled ? "No Forgot Password" : "Forgot Password"}
      </button>
      <Link href="/login">Visit Login page</Link>
    </div>
  );
}
