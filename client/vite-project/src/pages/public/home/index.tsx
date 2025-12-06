import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logoImage from "@/assets/logo.jpeg";
import HairParticles from "@/components/ui/HairParticles";

function Homepage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <HairParticles />

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="px-8 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary tracking-wider">
              S.H.E.Y
            </h1>
            <Button
              variant="outline"
              className="
  bg-white/80 
  backdrop-blur-sm 
  hover:bg-white 
  transition-smooth 
  hover:scale-[1.02] 
  shadow-soft 
  hover:shadow-hover
"
              asChild
            >
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </header>

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center min-h-[70vh]">
              <div className="flex flex-col gap-6">
                <h1 className="text-5xl font-bold text-foreground leading-tight">
                  Welcome to SHEY-SALON-SPA
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed bg-white/50 p-4 rounded-xl backdrop-blur-sm">
                  SHEY is a platform that connects barbers with customers. It
                  helps customers find barbers near them and book appointments
                  with ease.
                </p>
                <div>
                  <Button
  size="lg"
  className="
    bg-primary 
    text-primary-foreground 
    hover:bg-primary/90 
    transition-smooth 
    hover:scale-[1.02] 
    shadow-soft 
    hover:shadow-hover
  "
>
  Get Started
</Button>
                </div>
              </div>

              <div className="flex justify-center items-center">
                <img
                  src={logoImage}
                  alt="SHEY Barber Logo"
                  className="w-full max-w-md object-contain rounded-[2.5rem] shadow-2xl bg-teal-50/80 backdrop-blur-sm p-8"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Homepage;
