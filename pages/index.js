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
// ... (förkortad kod – här läggs hela canvas-koden in i verkligt projekt)
export default function InfiniSignalPage() {
  return <div className="text-green-400 bg-black min-h-screen flex justify-center items-center">Canvas-kod från Infini Signal Site kommer här</div>;
}
