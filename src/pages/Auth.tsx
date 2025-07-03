import React, { useState } from "react";
import { useSupabaseAuth } from "../contexts/SupabaseAuthContext";
import { Navigate } from "react-router-dom";

function Auth() {
  const { user, loading, signIn } = useSupabaseAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  if (!loading && user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await signIn(form.email, form.password);
    if (error) setError(error.message || "Login failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-6">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-teal-500 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-500 rounded-full opacity-25 animate-ping"></div>
        <div className="absolute top-60 right-1/3 w-28 h-28 bg-gray-400 rounded-full opacity-20 animate-pulse"></div>
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat bg-[length:60px_60px]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}>
          </div>
        </div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-md relative z-10 hover:bg-white/15 transition-all duration-300 glow-on-hover">
        <h2 className="text-2xl font-bold mb-4 text-white text-center bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
          SHREERAM MARKETING
        </h2>
        <p className="text-center text-white/80 mb-6">Premium Paints & Coatings Dealer</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full px-4 py-3 border border-white/30 bg-white/10 backdrop-blur-md rounded-lg text-white placeholder-white/70 focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-200"
            placeholder="Email"
            type="email"
            autoFocus
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
          />
          <input
            className="w-full px-4 py-3 border border-white/30 bg-white/10 backdrop-blur-md rounded-lg text-white placeholder-white/70 focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-200"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            required
          />
          {error && (
            <div className="p-2 bg-red-500/20 border border-red-400/30 rounded text-red-100 text-sm backdrop-blur-md">{error}</div>
          )}
          <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25" type="submit">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth;
