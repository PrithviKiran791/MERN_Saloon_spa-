import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const HairParticles = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(
    () => ({
      // Make canvas transparent so background color shows through
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 120,
      particles: {
        color: {
          value: "#000000", // Hair Color
        },
        move: {
          enable: true,
          direction: "none",
          random: true,
          speed: 1.5, // Gentle floating speed
          straight: false,
          outModes: {
            default: "out",
          },
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 50, // Amount of hair strands
        },
        opacity: {
          value: 0.3, // Semi-transparent
        },
        shape: {
          type: "line", // This creates the "Strand" look
        },
        size: {
          value: { min: 1, max: 2 }, // Thin lines
        },
        rotate: {
          value: 0,
          random: true,
          direction: "clockwise",
          animation: {
            enable: true,
            speed: 5,
            sync: false,
          },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  if (init) {
    return (
      <Particles
        id="tsparticles"
        // @ts-ignore
        options={options}
        // 👇 CRITICAL: z-index -10 forces it behind everything
        className="absolute inset-0 -z-10 h-full w-full" 
      />
    );
  }

  return <></>;
};

export default HairParticles;