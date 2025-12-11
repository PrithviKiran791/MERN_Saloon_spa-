import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logoImage from "@/assets/logo.jpeg";
import { WarpBackground } from "@/components/ui/shadcn-io/warp-background";
import TypingText from "@/components/ui/shadcn-io/typing-text";

function Homepage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0">
        <WarpBackground
          perspective={120}
          beamsPerSide={4}
          beamSize={6}
          beamDuration={4.5}
          className="min-h-full w-full p-0 border-0 rounded-none bg-transparent"
        >
          <div className="min-h-full" />
        </WarpBackground>
        <div className="absolute inset-0 bg-linear-to-b from-black via-slate-900 to-black opacity-70" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="px-8 py-6 bg-transparent">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white tracking-wider animate-fade-in">
              S.H.E.Y
            </h1>
            <Button
              variant="outline"
              className="bg-white/20 backdrop-blur-glass hover:bg-white/30 transition-all-smooth hover-scale shadow-soft hover:shadow-hover border-white/30 text-white"
              asChild
            >
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </header>

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-8 py-16 space-section">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center min-h-[70vh]">
              <div className="flex flex-col gap-6 animate-slide-in-left">
                <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                  Welcome to <span className="text-white">SHEY-SALON-SPA</span>
                </h1>
                <TypingText
                  text={[
                    "SHEY brings barbers and customers together",
                    "Find trusted barbers nearby instantly",
                    "Book appointments in seconds, not hours",
                    "Enjoy a smooth experience from start to finish"
                  ]}
                  typingSpeed={60}
                  pauseDuration={2000}
                  showCursor={true}
                  cursorCharacter="|"
                  className="text-lg leading-relaxed text-white/80"
                  textColors={['#ffffff', '#ffffff', '#ffffff']}
                  variableSpeed={{ min: 50, max: 80 }}
                />
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-white/90 transition-all-smooth hover-scale shadow-soft hover:shadow-glow"
                    asChild
                  >
                    <Link to="/register">Get Started</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 transition-all-smooth hover-scale shadow-soft"
                    asChild
                  >
                    <Link to="/login">Learn More</Link>
                  </Button>
                </div>
              </div>

              <div className="flex justify-center items-center animate-slide-in-right">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 rounded-[2.5rem] blur-2xl animate-pulse-slow"></div>
                  <img
                    src={logoImage}
                    alt="SHEY Barber Logo"
                    className="relative w-full max-w-md object-contain rounded-[2.5rem] shadow-2xl p-8 bg-white/5 backdrop-blur-glass border border-white/20 hover-lift"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Homepage;
