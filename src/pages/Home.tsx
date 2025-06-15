
import React from "react";
import Logo from "../components/Logo";
import indigoLogo from "../assets/indigo-logo.svg";
import duluxLogo from "../assets/dulux-logo.svg";

// Animated SVG background paint splashes and drips
const PaintSplashBG = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" width="100%" height="100%" viewBox="0 0 1200 600" style={{position: "absolute", top:0, left:0, zIndex:0}}>
    {/* Blur, semi-transparent paint splashes */}
    <ellipse cx="140" cy="120" rx="85" ry="42" fill="#fbbf24" opacity="0.15" />
    <ellipse cx="800" cy="80" rx="70" ry="32" fill="#2563eb" opacity="0.16" />
    <ellipse cx="1100" cy="220" rx="80" ry="45" fill="#dc2626" opacity="0.13" />
    {/* Large blue paint splash */}
    <path d="M340 440 Q380 370 480 390 T600 465 Q590 520 520 490 Q480 480 410 480 Z" fill="#2563eb" opacity="0.09">
      <animate attributeName="d" values="
        M340 440 Q380 370 480 390 T600 465 Q590 520 520 490 Q480 480 410 480 Z;
        M340 440 Q400 375 470 392 T595 470 Q590 520 520 490 Q480 480 410 480 Z;
        M340 440 Q380 370 480 390 T600 465 Q590 520 520 490 Q480 480 410 480 Z
      " keyTimes="0;0.5;1" dur="8s" repeatCount="indefinite" />
    </path>
    {/* Paint drips on top edge */}
    <path d="M90,0 Q115,24 140,0 T190,0 Q215,26 250,0" stroke="#eab308" strokeWidth="8" fill="none" opacity=".2">
      <animate attributeName="stroke-width" values="8;16;8" dur="2.5s" repeatCount="indefinite"/>
    </path>
    {/* Paint drip animation */}
    <ellipse cx="1050" cy="30" rx="7" ry="18" fill="#dc2626" opacity=".22">
      <animate attributeName="cy" values="30;90;30" dur="4s" repeatCount="indefinite" />
      <animate attributeName="rx" values="7;12;7" dur="4s" repeatCount="indefinite" />
    </ellipse>
  </svg>
);

// Paint stroke animated text (Company Name)
const BrushText = ({ children }: { children: React.ReactNode }) => (
  <span
    className="relative inline-block px-4"
    style={{
      background:
        "linear-gradient(110deg, #dc2626 20%, #eab308 55%, #2563eb 90%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      filter: "drop-shadow(0 3px 12px #0002) drop-shadow(0 1px 0px #fff9)"
    }}
  >
    <span className="animate-brushstroke">{children}</span>
    {/* Animated underline brush stroke */}
    <svg
      viewBox="0 0 200 12"
      className="absolute left-0 w-full h-3 mt-2"
      style={{top: "85%", left: "0"}}
    >
      <path
        d="M5,10 Q50,2 195,10"
        stroke="#eab308"
        strokeWidth="6"
        fill="none"
        opacity=".3"
      >
        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.4s" repeatCount="indefinite" />
      </path>
    </svg>
  </span>
);

// Animated paint roller for service list
const PaintRoller = ({ delay = 0 }) => (
  <svg width="40" height="28" viewBox="0 0 40 28" className="inline align-middle mr-2" style={{animation: `paintRollerSlide 1.3s ${delay}s cubic-bezier(0.7,0.2,0.2,1)`}}>
    <rect x="2" y="11" width="20" height="8" rx="3" fill="#fbbf24"/>
    <rect x="19" y="11" width="10" height="8" rx="3" fill="#a3e635"/>
    <rect x="32" y="15" width="6" height="3" rx="1.5" fill="#1e293b" />
    <rect x="18" y="17" width="3" height="8" rx="1.5" fill="#444" />
    <circle cx="18.5" cy="24.5" r="2" fill="#444" />
    <animateTransform attributeName="transform" type="translate" from="-15 0" to="0 0" dur="0.7s" begin={`${delay}s`} fill="freeze"/>
  </svg>
);

const SERVICES = [
  "Premium Interior & Exterior Paints",
  "Custom Color Mixing & Consultation",
  "Bulk Paint Supplies & Accessories",
  "Dealer Support & Expert Guidance",
  "Paint Tools and After-Sales Service",
];

const Home: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center py-0 overflow-x-hidden relative">
      {/* Animated SVG Background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <PaintSplashBG />
      </div>

      {/* Animated Logo + Paint drip */}
      <section className="w-full flex flex-col items-center pt-12 pb-2 z-10 relative">
        <div className="animate-float">
          <Logo className="h-28 w-auto mb-2 drop-shadow-2xl" />
        </div>
        {/* Color drip below logo */}
        <div className="flex gap-1 h-5 items-end justify-center mt-0">
          <div className="w-6 h-5 rounded-b-full bg-red-600 animate-drip" />
          <div className="w-4 h-3 rounded-b-full bg-yellow-400 animate-drip-slow" />
          <div className="w-7 h-4 rounded-b-full bg-blue-600 animate-drip-delay" />
        </div>

        {/* Company name with animated brush text */}
        <h1 className="text-4xl sm:text-6xl font-extrabold drop-shadow mt-4 font-playfair" style={{letterSpacing:".03em"}}>
          <BrushText>ShreeRam Marketing</BrushText>
        </h1>
        <h2 className="text-lg sm:text-2xl text-slate-700 dark:text-yellow-300 mt-3 font-medium font-playfair tracking-wide">
          Colorful Solutions for Every Project
        </h2>
        <div className="mt-2 sm:mt-4 max-w-xl text-center text-md sm:text-lg text-slate-600 dark:text-slate-200 font-light px-4">
          From vibrant walls to flawless finishes, our paints and creativity empower your dreams to shine bright.
        </div>
      </section>

      {/* Paint Roller-reveal Services */}
      <section className="w-full max-w-3xl mt-10 flex flex-col items-center px-3 pb-2 relative z-10">
        <h3 className="text-xl sm:text-2xl font-bold text-blue-800 dark:text-yellow-200 mb-4 tracking-wide">Our Services</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full z-10 relative">
          {SERVICES.map((service, i) => (
            <li
              key={service}
              className="bg-white/90 dark:bg-slate-900/70 rounded-xl px-6 py-5 shadow-xl border border-blue-100 dark:border-slate-700 flex items-center gap-3 text-blue-900 dark:text-yellow-100 font-semibold relative overflow-hidden interactive-card reveal"
              style={{
                animation: `serviceRevealAnim 0.9s cubic-bezier(0.66,0.34,0.16,0.88) both`,
                animationDelay: `${i * 0.12 + 0.25}s`,
              }}
            >
              <PaintRoller delay={i * 0.11 + 0.15} />
              <span>{service}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Paint Dealer Logos with creative paint effect */}
      <section className="w-full max-w-2xl mt-12 flex flex-col items-center px-3 mb-16 relative z-10">
        <h3 className="text-xl sm:text-2xl font-bold mb-5 text-blue-900 dark:text-white tracking-wide">We Proudly Deal In</h3>
        <div className="flex flex-wrap items-center justify-center gap-12 w-full">
          {/* Indigo Paints Logo with animated paint-splash reveal */}
          <div className="flex flex-col items-center group relative">
            {/* Paint splash behind logo */}
            <svg className="absolute -top-3 left-1/2 -translate-x-1/2 z-0" width="75" height="40">
              <ellipse cx="38" cy="25" rx="32" ry="14" fill="#7964e6" opacity="0.33">
                <animate attributeName="rx" values="32;40;32" dur="2.9s" repeatCount="indefinite"/>
              </ellipse>
            </svg>
            <div className="bg-white rounded-2xl p-5 shadow-lg transition-transform duration-400 hover:scale-110 z-10 animate-splash-in">
              <img
                src={indigoLogo}
                alt="Indigo Paints"
                className="h-14 sm:h-20 w-auto"
                style={{ filter: "drop-shadow(0 3px 20px #7964e6b0)" }}
              />
            </div>
            <span className="mt-3 text-indigo-900 dark:text-indigo-300 font-bold text-lg drop-shadow group-hover:underline transition-all duration-150">Indigo Paints</span>
            {/* Animated paint drip */}
            <svg width="18" height="34" className="absolute left-1/2 top-full -translate-x-1/2" style={{ zIndex: 10 }}>
              <ellipse cx="9" cy="11" rx="7" ry="11" fill="#7964e6" opacity="0.24">
                <animate attributeName="cy" values="11;27;11" dur="4.6s" repeatCount="indefinite"/>
              </ellipse>
            </svg>
          </div>
          {/* Dulux Logo with animated paint brush effect */}
          <div className="flex flex-col items-center group relative">
            {/* Animated brush behind Dulux */}
            <svg className="absolute -top-6 left-1/2 -translate-x-1/2 z-0" width="80" height="42">
              <path d="M4,30 Q32,5 76,31 Q58,38 19,38 Q10,36 4,30 Z" fill="#fb7185" opacity="0.19">
                <animate attributeName="opacity" values="0.19;0.44;0.19" dur="2.1s" repeatCount="indefinite" />
              </path>
            </svg>
            <div className="bg-white rounded-2xl p-5 shadow-lg transition-transform duration-400 hover:scale-110 z-10 animate-brush-in">
              <img
                src={duluxLogo}
                alt="Dulux"
                className="h-14 sm:h-20 w-auto"
                style={{ filter: "drop-shadow(0 3px 18px #286acbb0)" }}
              />
            </div>
            <span className="mt-3 text-blue-900 dark:text-blue-200 font-bold text-lg drop-shadow group-hover:underline transition-all duration-150">Dulux</span>
            {/* Animated color splash below */}
            <svg width="26" height="13" className="absolute left-1/2 top-full -translate-x-1/2 mt-2" style={{ zIndex: 10 }}>
              <ellipse cx="13" cy="9" rx="12" ry="4" fill="#286acb" opacity="0.15">
                <animate attributeName="rx" values="12;17;12" dur="3.6s" repeatCount="indefinite"/>
              </ellipse>
            </svg>
          </div>
        </div>
        {/* Decorative color streak at the bottom */}
        <div className="w-full flex justify-center mt-8 pointer-events-none">
          <div className="bg-gradient-to-r from-indigo-400 via-yellow-400 to-blue-500 rounded-full h-2 w-48 blur-lg opacity-60 animate-pulse"></div>
        </div>
      </section>
      
      {/* Extra Global CSS for Animations */}
      <style>{`
        @keyframes brushstroke {
          0% { opacity: 0; letter-spacing: 0.05em;  filter: blur(8px); }
          25% { opacity: 0.33; letter-spacing: 0; filter: blur(4px);}
          60% { opacity: 1; letter-spacing: 0.03em; filter: blur(0px);}
          100% { opacity: 1; }
        }
        .animate-brushstroke {
          animation: brushstroke 2s cubic-bezier(.8,-0.5,.2,1.1) 1 both;
        }
        @keyframes serviceRevealAnim {
          0% { opacity: 0; transform: translateY(28px) scale(0.96);}
          80% { opacity: 1; transform: translateY(-5px) scale(1.01);}
          100% { opacity: 1; transform: translateY(0) scale(1);}
        }
        @keyframes paintRollerSlide {
          0% { transform: translateX(-30px) scale(0.7);}
          82% { transform: translateX(2px) scale(1.08);}
          100% { transform: translateX(0px) scale(1);}
        }
        .animate-brush-in {
          animation: serviceRevealAnim 1.4s cubic-bezier(0.86,0.09,0.19,0.97) 0.39s both;
        }
        .animate-splash-in {
          animation: serviceRevealAnim 1.2s cubic-bezier(0.66,0.34,0.16,0.88) 0.25s both;
        }
        @keyframes drip {
          0%,100% {height:1.2rem; opacity:.6;}
          49% {height:2.2rem; opacity:1;}
          100% {height:1.2rem; opacity:.6;}
        }
        .animate-drip {
          animation: drip 1.9s ease-in-out infinite both;
        }
        .animate-drip-delay {
          animation: drip 2.5s .6s ease-in-out infinite both;
        }
        .animate-drip-slow {
          animation: drip 2.7s .35s ease-in-out infinite both;
        }
      `}</style>
    </main>
  );
};

export default Home;

