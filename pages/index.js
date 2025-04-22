import { useState, useEffect, useRef } from "react";
const Slider = ({ value, onValueChange, className, min, max, step }) => (
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={value}
    onChange={(e) => onValueChange([parseFloat(e.target.value)])}
    className={className}
  />
);
const Button = ({ children, ...props }) => (
  <button {...props}>{children}</button>
);

export default function InfiniSignalPage() {
  const [frequency, setFrequency] = useState(101.0);
  const [signalFound, setSignalFound] = useState(false);
  const [proximity, setProximity] = useState(0);

  const infiniRef = useRef(null);
  const noiseRef = useRef(null);

  useEffect(() => {
    const infiniAudio = new Audio("/Favors.mp3");
    const noiseAudio = new Audio("/shs_dt_interference_radio_monster_138.mp3");

    infiniRef.current = infiniAudio;
    noiseRef.current = noiseAudio;

    const playAudio = async () => {
      try {
        await infiniAudio.play();
        await noiseAudio.play();
        infiniAudio.loop = true;
        noiseAudio.loop = true;
        infiniAudio.volume = 0;
        noiseAudio.volume = 1;
      } catch (err) {
        console.warn("Autoplay might be blocked:", err);
      }
    };

    playAudio();
  }, []);

  const handleFrequencyChange = (value) => {
    const freq = typeof value === "number" ? parseFloat(value.toFixed(1)) : 101.0;
    setFrequency(freq);
    const match = freq === 104.6;
    setSignalFound(match);

    const distance = Math.abs(freq - 104.6);
    const proximityValue = Math.max(0, 1 - distance / 3);
    setProximity(proximityValue);

    if (infiniRef.current) infiniRef.current.volume = proximityValue;
    if (noiseRef.current) noiseRef.current.volume = 1 - proximityValue;

    if (match) {
      const body = document.body;
      body.classList.add("glow-flash");
      setTimeout(() => {
        body.classList.remove("glow-flash");
      }, 1200);
    }
  };

  const getSignalDots = () => {
    const totalDots = 20;
    const activeDots = Math.round(proximity * totalDots);
    return Array.from({ length: totalDots }, (_, i) => (
      <span
        key={i}
        className={`mx-0.5 text-lg ${i < activeDots ? "text-green-400" : "text-green-900"}`}
      >
        ●
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-black text-green-400 flex flex-col items-center justify-center p-6 space-y-10 font-mono relative overflow-hidden">
      <div className="z-10 text-center space-y-10">
        <h1 className="text-2xl tracking-widest text-green-400 animate-pulse">
          {signalFound ? "SYSTEM LINK FOUND" : "NO SIGNAL"}
        </h1>

        <div className="text-5xl tracking-widest font-semibold transition duration-500 ease-in-out animate-fade-in">
          {signalFound
            ? "INFINI"
            : frequency >= 107
            ? "TIANGONG"
            : frequency >= 106
            ? "MIR"
            : frequency >= 105
            ? "SKYLAB"
            : frequency >= 104
            ? "ISS"
            : frequency >= 103
            ? "LUNAR GATEWAY"
            : frequency >= 102
            ? "ALPHA"
            : "ASTRA"}
        </div>

        <Slider
          value={[frequency]}
          min={101.0}
          max={108.8}
          step={0.1}
          onValueChange={(val) => handleFrequencyChange(val[0])}
          className="w-80"
        />

        <div className="flex justify-center mt-4">
          {getSignalDots()}
        </div>

        {signalFound ? (
          <div className="text-center space-y-4 mt-8 animate-glow">
            <p className="text-lg text-green-300 uppercase tracking-wide">
              ∞ ACCESS GRANTED
            </p>
            <p className="text-sm text-green-100 italic">
              Signal locked. Welcome to the real feed.
            </p>
            <a
              href="https://open.spotify.com/artist/6tEEYnHxidx7lJ67rjLfiG?si=gN0BhMxCR_WX-N0eDhRWDw"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="mt-2 text-base px-5 py-2 rounded-xl bg-green-700 hover:bg-green-600">
                OPEN THE CHANNEL
              </Button>
            </a>
          </div>
        ) : (
          <div className="text-center mt-6 space-y-2 animate-flicker">
            <p className="text-xs italic text-green-600">SEARCHING . . .</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes flicker {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
        .animate-flicker {
          animation: flicker 1.2s infinite;
        }

        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-in-out;
        }

        @keyframes glowFlash {
          0% { background-color: #00ff00; }
          100% { background-color: black; }
        }
        .glow-flash {
          animation: glowFlash 1.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}
