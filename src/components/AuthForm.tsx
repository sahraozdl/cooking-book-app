"use client";

import { useState } from "react";
import { signUpUser, signInUser } from "@/store/firebase/auth";
import { useRouter } from "next/navigation";

export function AuthForm() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState("");

  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    setError("");

    try {
      if (isSignUp) {
        const user = await signUpUser(formData);
        if (user?.errors) {
          setError(
            `Invalid input:\n${user.errors.name?.join(", ") ?? ""}\n${
              user.errors.email?.join(", ") ?? ""
            }\n${user.errors.password?.join(", ") ?? ""}`
          );
          return;
        }
      } else {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        await signInUser({ email, password });
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Error:", err);
      setError("Authentication failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-10 relative z-10 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="text-black">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {isSignUp ? "Sign Up" : "Sign In"}
          </h2>

          {error && (
            <p className="text-red-600 whitespace-pre-line mb-4">{error}</p>
          )}

          {isSignUp && (
            <div className="mb-4">
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                name="username"
                placeholder="Username"
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white rounded"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>

          <p className="mt-4 text-center text-sm text-gray-700">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={toggleForm}
              className="text-blue-600 underline"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
