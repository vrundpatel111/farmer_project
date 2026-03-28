import React from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticlesBackground = () => {
    const particlesInit = async (main) => {
        await loadFull(main);
    };

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                fullScreen: {
                    enable: true,
                    zIndex: -1
                },
                background: {
                    color: {
                        value: "#f5f5f5" 
                    }
                },
                particles: {
                    number: {
                        value: 100
                    },
                    color: {
                        value: "#0F172A" // green theme 🌿
                    },
                    links: {
                        enable: true,
                        color: "#0F172A",
                        distance: 120
                    },
                    move: {
                        enable: true,
                        speed: 2
                    },
                    size: {
                        value: 3
                    },
                    opacity: {
                        value: 0.5
                    }
                }
            }}
        />
    );
};

export default ParticlesBackground;