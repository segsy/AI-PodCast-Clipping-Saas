"use client";

import { useState, useEffect, useRef } from "react";
import { Copy, Check, Download, RefreshCw, Plus, X, Heart, Trash2, Image } from "lucide-react";

type GradientType = "linear" | "radial" | "conic";

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

interface SavedGradient {
  id: string;
  name: string;
  gradientType: GradientType;
  angle: number;
  colorStops: ColorStop[];
  createdAt: number;
}

const STORAGE_KEY = "savedGradients";

export default function GradientGeneratorPage() {
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(90);
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { id: "1", color: "#6366f1", position: 0 },
    { id: "2", color: "#ec4899", position: 100 },
  ]);
  const [generatedCSS, setGeneratedCSS] = useState("");
  const [copied, setCopied] = useState(false);
  const [savedGradients, setSavedGradients] = useState<SavedGradient[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [gradientName, setGradientName] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const exportCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateCSS();
    // Load saved gradients from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedGradients(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved gradients:", e);
      }
    }
  }, [gradientType, angle, colorStops]);

  const generateCSS = () => {
    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
    const colorString = sortedStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ");

    let css = "";
    switch (gradientType) {
      case "linear":
        css = `linear-gradient(${angle}deg, ${colorString})`;
        break;
      case "radial":
        css = `radial-gradient(circle, ${colorString})`;
        break;
      case "conic":
        css = `conic-gradient(from ${angle}deg, ${colorString})`;
        break;
    }

    setGeneratedCSS(css);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCSS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadCSS = () => {
    const fullCSS = `.gradient {\n  background: ${generatedCSS};\n}`;
    const blob = new Blob([fullCSS], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gradient.css";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAsPNG = () => {
    const canvas = exportCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 1200;
    canvas.height = 630;

    // Create gradient
    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
    let gradient: CanvasGradient;

    const rad = angle * Math.PI / 180;
    
    if (gradientType === "linear") {
      const x1 = canvas.width / 2 - Math.cos(rad) * canvas.width / 2;
      const y1 = canvas.height / 2 - Math.sin(rad) * canvas.height / 2;
      const x2 = canvas.width / 2 + Math.cos(rad) * canvas.width / 2;
      const y2 = canvas.height / 2 + Math.sin(rad) * canvas.height / 2;
      gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    } else if (gradientType === "radial") {
      gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    } else {
      gradient = ctx.createConicGradient(rad, canvas.width / 2, canvas.height / 2);
    }

    sortedStops.forEach((stop) => {
      gradient.addColorStop(stop.position / 100, stop.color);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Download
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "gradient.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const saveGradient = () => {
    if (!gradientName.trim()) return;

    const newGradient: SavedGradient = {
      id: Date.now().toString(),
      name: gradientName.trim(),
      gradientType,
      angle,
      colorStops: [...colorStops],
      createdAt: Date.now(),
    };

    const updated = [newGradient, ...savedGradients];
    setSavedGradients(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setGradientName("");
    setShowSaveModal(false);
  };

  const deleteGradient = (id: string) => {
    const updated = savedGradients.filter((g) => g.id !== id);
    setSavedGradients(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const loadGradient = (saved: SavedGradient) => {
    setGradientType(saved.gradientType);
    setAngle(saved.angle);
    setColorStops(saved.colorStops);
    setShowSaved(false);
  };

  const addColorStop = () => {
    const newId = Date.now().toString();
    const lastPosition = colorStops[colorStops.length - 1]?.position || 0;
    const newPosition = Math.min(lastPosition + 20, 100);
    setColorStops([
      ...colorStops,
      { id: newId, color: "#ffffff", position: newPosition },
    ]);
  };

  const removeColorStop = (id: string) => {
    if (colorStops.length <= 2) return;
    setColorStops(colorStops.filter((stop) => stop.id !== id));
  };

  const updateColorStop = (id: string, updates: Partial<ColorStop>) => {
    setColorStops(
      colorStops.map((stop) => (stop.id === id ? { ...stop, ...updates } : stop))
    );
  };

  const handleColorInput = (id: string, color: string) => {
    updateColorStop(id, { color });
  };

  const presetGradients = [
    { name: "Sunset", colors: ["#ff512f", "#dd2476"] },
    { name: "Ocean", colors: ["#2193b0", "#6dd5ed"] },
    { name: "Forest", colors: ["#134e5e", "#71b280"] },
    { name: "Purple", colors: ["#8e2de2", "#4a00e0"] },
    { name: "Fire", colors: ["#f12711", "#f5af19"] },
    { name: "Sky", colors: ["#56ccf2", "#2f80ed"] },
    { name: "Pink", colors: ["#ec008c", "#fc6767"] },
    { name: "Mint", colors: ["#a8ff78", "#78ffd6"] },
    { name: "Aurora", colors: ["#00c9ff", "#92fe9d"] },
    { name: "Blush", colors: ["#ff9a9e", "#fecfef"] },
    { name: "Lemon", colors: ["#f6d365", "#fda085"] },
    { name: "Violet", colors: ["#667eea", "#764ba2"] },
    { name: "Peach", colors: ["#ffecd2", "#fcb69f"] },
    { name: "Midnight", colors: ["#232526", "#414345"] },
    { name: "Candy", colors: ["#d53369", "#daae51"] },
    { name: "Royal", colors: ["#141e30", "#243b55"] },
  ];

  const applyPreset = (colors: string[]) => {
    const newStops = colors.map((color, index) => ({
      id: (index + 1).toString(),
      color,
      position: index === 0 ? 0 : 100,
    }));
    setColorStops(newStops);
  };

  const randomizeGradient = () => {
    const randomColor = () =>
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
    const newStops = [
      { id: "1", color: randomColor(), position: 0 },
      { id: "2", color: randomColor(), position: 100 },
    ];
    setColorStops(newStops);
    setAngle(Math.floor(Math.random() * 360));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            CSS Gradient Generator
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSaved(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Saved ({savedGradients.length})</span>
            </button>
            <button
              onClick={randomizeGradient}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Randomize</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Gradient Type */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-lg font-semibold mb-4">Gradient Type</h2>
              <div className="grid grid-cols-3 gap-3">
                {(["linear", "radial", "conic"] as GradientType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setGradientType(type)}
                    className={`px-4 py-3 rounded-xl font-medium capitalize transition-all ${
                      gradientType === type
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Angle Control */}
            {gradientType !== "radial" && (
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <h2 className="text-lg font-semibold mb-4">Angle</h2>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="w-16 text-center font-mono text-indigo-400">
                    {angle}°
                  </span>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>0°</span>
                  <span>90°</span>
                  <span>180°</span>
                  <span>270°</span>
                  <span>360°</span>
                </div>
              </div>
            )}

            {/* Color Stops */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Color Stops</h2>
                <button
                  onClick={addColorStop}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Color
                </button>
              </div>

              <div className="space-y-4">
                {[...colorStops]
                  .sort((a, b) => a.position - b.position)
                  .map((stop) => (
                    <div
                      key={stop.id}
                      className="flex items-center gap-4 p-3 bg-gray-800 rounded-xl"
                    >
                      <div className="relative">
                        <input
                          type="color"
                          value={stop.color}
                          onChange={(e) => handleColorInput(stop.id, e.target.value)}
                          className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-600"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-400">Position</span>
                          <span className="text-sm font-mono text-indigo-400">
                            {stop.position}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={stop.position}
                          onChange={(e) =>
                            updateColorStop(stop.id, {
                              position: Number(e.target.value),
                            })
                          }
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <input
                        type="text"
                        value={stop.color}
                        onChange={(e) => handleColorInput(stop.id, e.target.value)}
                        className="w-24 px-3 py-2 bg-gray-700 rounded-lg font-mono text-sm uppercase"
                      />

                      <button
                        onClick={() => removeColorStop(stop.id)}
                        disabled={colorStops.length <= 2}
                        className="p-2 text-gray-400 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Presets */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-lg font-semibold mb-4">Quick Presets</h2>
              <div className="grid grid-cols-4 gap-3">
                {presetGradients.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset.colors)}
                    className="group relative h-12 rounded-xl overflow-hidden border-2 border-transparent hover:border-white transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})`,
                    }}
                    title={preset.name}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            {/* Live Preview */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-lg font-semibold mb-4">Live Preview</h2>
              <div
                className="w-full h-80 rounded-2xl transition-all duration-300"
                style={{ background: generatedCSS }}
              />
            </div>

            {/* CSS Output */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Generated CSS</h2>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={downloadCSS}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>CSS</span>
                  </button>
                  <button
                    onClick={exportAsPNG}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
                  >
                    <Image className="w-4 h-4" />
                    <span>PNG</span>
                  </button>
                  <button
                    onClick={() => setShowSaveModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 rounded-lg transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <pre className="p-4 bg-gray-950 rounded-xl overflow-x-auto text-sm font-mono text-gray-300 border border-gray-800">
                  <code>{`.gradient {
  background: ${generatedCSS};
}`}</code>
                </pre>
              </div>

              {/* Alternative Formats */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  CSS Variables Format
                </h3>
                <pre className="p-4 bg-gray-950 rounded-xl overflow-x-auto text-sm font-mono text-gray-300 border border-gray-800">
                  <code>{`:root {
  --gradient-color-1: ${colorStops[0]?.color || "#000000"};
  --gradient-color-2: ${colorStops[1]?.color || "#ffffff"};
  --gradient-direction: ${gradientType === "linear" ? `${angle}deg` : gradientType};
  --gradient: ${generatedCSS};
}`}</code>
                </pre>
              </div>
            </div>

            {/* Preview with Content */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-lg font-semibold mb-4">Preview with Content</h2>
              <div
                className="w-full h-40 rounded-2xl flex items-center justify-center"
                style={{ background: generatedCSS }}
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                    Beautiful Gradient
                  </h3>
                  <p className="text-white/80 drop-shadow">
                    Use it for backgrounds, buttons, and more!
                  </p>
                </div>
              </div>

              {/* Button Preview */}
              <div className="mt-4 flex gap-4 flex-wrap">
                <button
                  className="px-6 py-3 rounded-xl font-semibold text-white transition-transform hover:scale-105"
                  style={{ background: generatedCSS }}
                >
                  Primary Button
                </button>
                <button
                  className="px-6 py-3 rounded-xl font-semibold border-2 transition-colors hover:bg-white/10"
                  style={{ borderColor: colorStops[0]?.color, color: colorStops[0]?.color }}
                >
                  Outlined Button
                </button>
                <div
                  className="px-6 py-3 rounded-xl font-semibold text-transparent bg-clip-text"
                  style={{ backgroundImage: generatedCSS }}
                >
                  Gradient Text
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Gradients Panel */}
      {showSaved && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Saved Gradients</h2>
              <button
                onClick={() => setShowSaved(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {savedGradients.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No saved gradients yet. Create one and click Save!</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {savedGradients.map((saved) => {
                  const sortedStops = [...saved.colorStops].sort((a, b) => a.position - b.position);
                  const css = saved.gradientType === "linear" 
                    ? `linear-gradient(${saved.angle}deg, ${sortedStops.map(s => `${s.color} ${s.position}%`).join(", ")})`
                    : saved.gradientType === "radial"
                    ? `radial-gradient(circle, ${sortedStops.map(s => `${s.color} ${s.position}%`).join(", ")})`
                    : `conic-gradient(from ${saved.angle}deg, ${sortedStops.map(s => `${s.color} ${s.position}%`).join(", ")})`;
                  return (
                    <div
                      key={saved.id}
                      className="group relative rounded-xl overflow-hidden border-2 border-gray-700 hover:border-white transition-all cursor-pointer"
                      style={{ background: css }}
                      onClick={() => loadGradient(saved)}
                    >
                      <div className="h-24" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 flex items-center justify-between">
                        <span className="text-sm font-medium truncate">{saved.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteGradient(saved.id);
                          }}
                          className="p-1 hover:bg-red-500 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Save Gradient</h2>
              <button
                onClick={() => setShowSaveModal(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">Gradient Name</label>
              <input
                type="text"
                value={gradientName}
                onChange={(e) => setGradientName(e.target.value)}
                placeholder="My Awesome Gradient"
                className="w-full px-4 py-3 bg-gray-800 rounded-xl border border-gray-700 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Preview</label>
              <div
                className="w-full h-24 rounded-xl"
                style={{ background: generatedCSS }}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveGradient}
                disabled={!gradientName.trim()}
                className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for export */}
      <canvas ref={exportCanvasRef} className="hidden" />
    </div>
  );
}
