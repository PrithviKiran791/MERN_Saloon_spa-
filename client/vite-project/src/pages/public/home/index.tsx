import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logoImage from "@/assets/logo.jpeg";

function Homepage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden animate-gradient-bg">
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="px-8 py-6 bg-purple-600">
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
                <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight text-shadow">
                  Welcome to <span className="gradient-text">SHEY-SALON-SPA</span>
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  SHEY is a platform that connects barbers with customers. It
                  helps customers find barbers near them and book appointments
                  with ease.
                </p>
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all-smooth hover-scale shadow-soft hover:shadow-glow btn-glow"
                    asChild
                  >
                    <Link to="/register">Get Started</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-border hover:bg-muted transition-all-smooth hover-scale shadow-soft"
                    asChild
                  >
                    <Link to="/login">Learn More</Link>
                  </Button>
                </div>
              </div>

              <div className="flex justify-center items-center animate-slide-in-right">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-2xl animate-pulse-slow"></div>
                  <img
                    src={logoImage}
                    alt="SHEY Barber Logo"
                    className="relative w-full max-w-md object-contain rounded-[2.5rem] shadow-2xl p-8 bg-card/50 backdrop-blur-glass border border-border/50 hover-lift"
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
