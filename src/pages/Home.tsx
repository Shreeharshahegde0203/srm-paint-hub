
import React from "react";
import Logo from "../components/Logo";
import indigoLogo from "../assets/indigo-logo.svg";
import duluxLogo from "../assets/dulux-logo.svg";

const SERVICES = [
  "Premium Paints for Interior & Exterior",
  "Color Consultation & Site Visits",
  "Bulk Orders & Dealer Support",
  "Painting Tools & Accessories",
  "Expert Guidance & After-Sales Service"
];

const Home: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center py-0">
      {/* Animated Hero Section */}
      <section className="w-full flex flex-col items-center pt-10 pb-2">
        <div className="animate-float"><Logo className="h-24 w-auto mb-3 drop-shadow-2xl" /></div>
        <h1 className="text-3xl sm:text-5xl font-bold text-blue-900 dark:text-yellow-400 drop-shadow mt-2 font-playfair">ShreeRam Marketing</h1>
        <h2 className="text-lg sm:text-2xl text-slate-700 dark:text-yellow-200 mt-3 font-semibold">Welcome to Your Trusted Paint Solution</h2>
        <div className="mt-2 max-w-xl text-center text-md sm:text-lg text-slate-600 dark:text-slate-200">
          Since 2011, providing premium Indigo and Dulux paints, expert advice, and all accessories for Maharashtra homes and businesses.
        </div>
      </section>

      {/* Services Offered */}
      <section className="w-full max-w-3xl mt-10 flex flex-col items-center px-3 pb-2">
        <h3 className="text-xl sm:text-2xl font-bold text-blue-800 dark:text-yellow-200 mb-4 tracking-wide">Our Services</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {SERVICES.map((service, i) => (
            <li key={service} className="bg-white/80 dark:bg-slate-800/70 rounded-xl px-6 py-4 m-1 shadow hover-scale font-medium text-blue-900 dark:text-yellow-100 transition-all duration-300 border border-blue-100 dark:border-slate-700 animate-fade-in" style={{animationDelay: `${i * 0.09}s`}}>
              {service}
            </li>
          ))}
        </ul>
      </section>

      {/* Dealer Section */}
      <section className="w-full max-w-2xl mt-10 flex flex-col items-center px-3 mb-16">
        <h3 className="text-xl sm:text-2xl font-bold mb-5 text-blue-900 dark:text-white tracking-wide">Authorized Dealers For</h3>
        <div className="flex flex-wrap items-center justify-center gap-8 w-full">
          {/* Indigo Paints Logo */}
          <div className="flex flex-col items-center group">
            <div className="bg-white rounded-2xl p-4 shadow-lg transition-transform duration-400 hover:scale-105 animate-float">
              <img
                src={indigoLogo}
                alt="Indigo Paints"
                className="h-14 sm:h-20 w-auto animate-shimmer"
                style={{ filter: "drop-shadow(0 2px 18px #7964e6b0)" }}
              />
            </div>
            <span className="mt-2 text-indigo-900 dark:text-indigo-300 font-semibold text-md tracking-wide group-hover:underline">Indigo Paints</span>
          </div>
          {/* Dulux Logo with "paint splash" floating animation */}
          <div className="flex flex-col items-center group">
            <div className="bg-white rounded-2xl p-4 shadow-lg transition-transform duration-400 hover:scale-105 animate-float" style={{ animationDuration: "4s" }}>
              <img
                src={duluxLogo}
                alt="Dulux"
                className="h-14 sm:h-20 w-auto animate-shimmer"
                style={{ filter: "drop-shadow(0 2px 18px #286acbb0)" }}
              />
            </div>
            <span className="mt-2 text-blue-900 dark:text-blue-200 font-semibold text-md tracking-wide group-hover:underline">Dulux</span>
          </div>
        </div>
        {/* Small animated splash below logos */}
        <div className="w-full flex justify-center mt-6">
          <div className="bg-gradient-to-r from-indigo-400 via-yellow-400 to-blue-500 rounded-full h-2 w-36 blur-lg opacity-70 animate-pulse"></div>
        </div>
      </section>
    </main>
  );
};

export default Home;
