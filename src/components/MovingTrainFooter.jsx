import trainMove from "../assets/train-move.png";
import { useEffect, useState } from "react";

const MovingTrainFooter = () => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    // Watch for dark mode class changes on <html>
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 w-full h-28 pointer-events-none z-30
                 border-t backdrop-blur-sm overflow-hidden transition-colors duration-300"
      style={{
        background: isDark
          ? "linear-gradient(to right, rgba(15,23,42,0.98), rgba(2,6,23,0.98), rgba(15,23,42,0.98))"
          : "linear-gradient(to right, rgba(240,253,250,0.92), rgba(240,249,255,0.92), rgba(236,253,245,0.92))",
        borderColor: isDark ? "rgba(51,65,85,0.6)" : "rgba(153,212,196,0.5)",
      }}
    >
      {/* Overhead Catenary Electric Power Line */}
      <div
        className="absolute top-2 left-0 w-full h-[1px]"
        style={{ background: isDark ? "rgba(251,191,36,0.5)" : "rgba(148,163,184,0.2)" }}
      ></div>

      {/* Railway Track Structure */}
      <div className="absolute bottom-0 w-full flex flex-col items-center">
        {/* Wooden Ties / Sleepers */}
        <div
          className="w-full h-2"
          style={{
            opacity: isDark ? 0.35 : 0.6,
            backgroundImage: isDark
              ? "repeating-linear-gradient(90deg, #334155 0px, #334155 6px, transparent 6px, transparent 24px)"
              : "repeating-linear-gradient(90deg, #475569 0px, #475569 6px, transparent 6px, transparent 24px)",
          }}
        ></div>
        {/* Steel Rail */}
        <div
          className="w-full h-[3px] shadow-sm"
          style={{ background: isDark ? "#94a3b8" : "#64748b" }}
        ></div>
        {/* Ballast Base */}
        <div
          className="w-full h-3"
          style={{
            background: isDark
              ? "linear-gradient(to bottom, rgba(30,41,59,0.6), #020617)"
              : "linear-gradient(to bottom, rgba(148,163,184,0.4), rgba(100,116,139,0.8))",
          }}
        ></div>
      </div>

      {/* Moving Train Group */}
      <div className="absolute bottom-1 w-[380px] sm:w-[460px] animate-trainMove flex items-end">
        <div className="relative w-full">
          {/*
            LIGHT MODE: mix-blend-mode:multiply removes the white background so the train
            appears to float on the light-colored footer.
            DARK MODE: normal blend so the train image shows clearly against dark bg.
          */}
          <img
            src={trainMove}
            alt="Indian Railway WAP-7 Locomotive"
            style={{
              mixBlendMode: isDark ? "normal" : "multiply",
              filter: isDark
                ? "brightness(0.88) contrast(1.1) drop-shadow(0 8px 20px rgba(0,0,0,0.85))"
                : "drop-shadow(0 3px 6px rgba(0,0,0,0.15))",
              width: "100%",
              objectFit: "contain",
            }}
          />

          {/* ✨ DARK MODE ONLY: Headlight beam cone shooting forward (right = front of moving train) */}
          {isDark && (
            <>
              {/* Wide diffuse light cone */}
              <div
                className="absolute pointer-events-none animate-headlight"
                style={{
                  bottom: "18px",
                  right: "-15px",
                  width: "170px",
                  height: "65px",
                  background:
                    "conic-gradient(from -18deg at 0% 50%, transparent 0deg, rgba(253,224,71,0.4) 18deg, rgba(254,249,195,0.18) 36deg, transparent 55deg)",
                  filter: "blur(7px)",
                }}
              ></div>
              {/* Secondary softer glow layer */}
              <div
                className="absolute pointer-events-none animate-headlight"
                style={{
                  bottom: "22px",
                  right: "0px",
                  width: "100px",
                  height: "40px",
                  background:
                    "radial-gradient(ellipse at 0% 50%, rgba(253,224,71,0.5) 0%, rgba(253,224,71,0.15) 50%, transparent 80%)",
                  filter: "blur(5px)",
                }}
              ></div>
              {/* Headlight lens dot glow */}
              <div
                className="absolute pointer-events-none animate-headlight"
                style={{
                  bottom: "27px",
                  right: "7px",
                  width: "9px",
                  height: "9px",
                  background: "rgba(255,255,230,1)",
                  borderRadius: "50%",
                  boxShadow:
                    "0 0 8px 5px rgba(253,224,71,0.9), 0 0 18px 10px rgba(253,224,71,0.45), 0 0 30px 18px rgba(253,224,71,0.15)",
                  filter: "blur(0.5px)",
                }}
              ></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovingTrainFooter;
