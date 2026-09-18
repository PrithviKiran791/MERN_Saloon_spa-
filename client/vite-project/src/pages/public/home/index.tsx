import { useNavigate } from "react-router-dom";
import logoImage from "@/assets/logo.jpeg";
import SpecularButton from "@/components/ui/specular-button";
import { GlareCard } from "@/components/ui/glare-card";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import SplitText from "@/components/ui/split-text";
import TypewriterEffect from "@/components/ui/typewriter-effect";
import SplitFlapText from "@/components/ui/split-flap-text";

function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-transparent text-white">
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="px-8 py-6 bg-transparent">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") navigate("/");
              }}
              aria-label="S.H.E.Y Home"
            >
              <SplitFlapText
                words={["S.H.E.Y"]}
                flipDuration={0.12}
                stagger={0.06}
                cycleDelay={2400}
                charset="alphanumeric"
                flipsPerChar={8}
                tileColor="#111827"
                textColor="#f8fafc"
                tileRadius={6}
                gap={5}
                fontSize="clamp(24px, 4vw, 32px)"
                loop
                padTo={7}
                className="brand-wordmark"
              />
            </div>
            <SpecularButton size="sm" onClick={() => navigate("/login")}>
              Login
            </SpecularButton>
          </div>
        </header>

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-8 py-16 space-section">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center min-h-[70vh]">
              <div className="flex flex-col gap-6">
                <SplitText
                  text={"Welcome to\nSHEY-SALON-SPA"}
                  tag="h1"
                  className="text-5xl md:text-6xl font-bold text-white leading-tight"
                  delay={45}
                  duration={1.1}
                  ease="power3.out"
                  threshold={0.1}
                  rootMargin="-80px"
                />
                <TypewriterEffect
                  words={[
                    { text: "Find trusted barbers nearby instantly" },
                  ]}
                  typingSpeed={55}
                  pauseDuration={2000}
                  className="text-lg leading-relaxed"
                />
                <div className="flex gap-4">
                  <SpecularButton size="lg" onClick={() => navigate("/register")}>
                    Get Started
                  </SpecularButton>
                  <SpecularButton
                    size="lg"
                    baseColor="#1f2937"
                    onClick={() => navigate("/login")}
                  >
                    Learn More
                  </SpecularButton>
                </div>
              </div>

              <div className="flex justify-center items-center animate-slide-in-right">
                <BackgroundGradient className="group">
                  <GlareCard>
                    <img
                      src={logoImage}
                      alt="SHEY Barber Logo"
                      className="w-full max-w-md object-contain rounded-[1.4rem] p-8 drop-shadow-2xl transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </GlareCard>
                </BackgroundGradient>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Homepage;
