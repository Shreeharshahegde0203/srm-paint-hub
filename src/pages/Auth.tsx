
import React, { useState } from "react";
import { useSupabaseAuth } from "../contexts/SupabaseAuthContext";
import { Navigate } from "react-router-dom";

function Auth() {
  const { user, loading, signIn, signUp } = useSupabaseAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  if (!loading && user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (isLogin) {
      const { error } = await signIn(form.email, form.password);
      if (error) setError(error.message || "Login failed");
    } else {
      const { error } = await signUp(form.email, form.password);
      if (error) setError(error.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-red-700 p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
          {isLogin ? "Login" : "Sign up"}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            placeholder="Email"
            type="email"
            autoFocus
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
          />
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            required
          />
          {error && (
            <div className="p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">{error}</div>
          )}
          <button className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800" type="submit">
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            className="text-blue-700 hover:underline font-medium"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
