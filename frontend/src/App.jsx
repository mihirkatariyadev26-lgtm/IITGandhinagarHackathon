import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  Sparkles,
  Image as ImageIcon,
  Download,
  AlertCircle,
  Loader2,
  Dice5,
  Clock,
  X,
} from "lucide-react";
import { SURPRISE_PROMPTS } from "./prompts";
import { LOADING_HINTS } from "./hints";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("imgHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = useState(false);
  const [currentHint, setCurrentHint] = useState("");

  // Rotate hints while loading
  useEffect(() => {
    let interval;
    if (loading) {
      setCurrentHint(
        LOADING_HINTS[Math.floor(Math.random() * LOADING_HINTS.length)],
      );
      interval = setInterval(() => {
        setCurrentHint(
          LOADING_HINTS[Math.floor(Math.random() * LOADING_HINTS.length)],
        );
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && e.ctrlKey && prompt.trim()) {
        handleImageSubmit();
      }
      if (e.key === "Escape") {
        setShowHistory(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prompt]);

  // Save history
  const saveToHistory = (url, promptText) => {
    const newHistory = [
      { url, prompt: promptText, date: Date.now() },
      ...history,
    ].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem("imgHistory", JSON.stringify(newHistory));
  };

  const handleSurprise = () => {
    const randomPrompt =
      SURPRISE_PROMPTS[Math.floor(Math.random() * SURPRISE_PROMPTS.length)];
    setPrompt(randomPrompt);
  };

  const handleImageSubmit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setImgError(false);
    setImageUrl(null);
    try {
      const response = await fetch("http://127.0.0.1:3000/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Image generation failed");

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("image")) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
        // For persistent history, we'd need base64 or to re-fetch the image from a persistent URL.
        // For now, we'll save the prompt and let the user regenerate if needed.
        saveToHistory(null, prompt); // Flux blobs expire, so just save prompt
      } else {
        const data = await response.json();
        setImageUrl(data.imageUrl);
        saveToHistory(data.imageUrl, prompt);
      }

      // If blob logic (above) sets url, we need to save it too.
      // Wait, blob URL is temporary. We can't save blob URL to localStorage easily?
      // Actually we can, but it revokes on reload.
      // For persistent history, we'd need base64.
      // For now, let's just save the prompt.
      // User can regenerate.
      // Or we can convert blob to base64.
    } catch (error) {
      console.error("Error generating image:", error);
      setImgError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `autobrand-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="app-container">
      <div className="bg-mesh" />

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        style={{ textAlign: "center", width: "100%", maxWidth: "1200px" }}>
        <h1 className="title">
          AutoBrand<span style={{ color: "var(--primary)" }}>AI</span>
        </h1>
        <p className="subtitle">
          Generate stunning, futuristic visuals with the power of Gemini & Flux.
        </p>
      </motion.div>

      <motion.div
        className="glass-panel prompt-form"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}>
        <div className="input-wrapper">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your vision (e.g., 'A cyberpunk city with neon rain')..."
            className="prompt-input"
            rows={4}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "15px",
            alignItems: "center",
          }}>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSurprise}
            className="secondary-btn"
            title="Surprise Me"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "10px 15px",
              borderRadius: "10px",
              color: "white",
              cursor: "pointer",
              display: "flex",
              gap: "5px",
            }}>
            <Dice5 size={18} />{" "}
            <span className="mobile-hidden">Surprise Me</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleImageSubmit}
            className="submit-btn"
            disabled={loading || !prompt.trim()}>
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Generating...
              </>
            ) : (
              <>
                <Sparkles size={20} /> Generate Magic
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* History Toggle */}
      {history.length > 0 && (
        <motion.div
          style={{ marginTop: "30px", width: "100%", maxWidth: "700px" }}>
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.9rem",
              marginBottom: "10px",
              marginLeft: "10px",
            }}>
            <Clock size={16} />{" "}
            {showHistory ? "Hide Recent" : "Show Recent History"}
          </button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: "hidden" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    overflowX: "auto",
                    padding: "10px",
                    paddingBottom: "15px",
                  }}
                  className="history-scroll">
                  {history.map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setPrompt(item.prompt)}
                      className="glass-panel"
                      style={{
                        minWidth: "120px",
                        maxWidth: "120px",
                        padding: "10px",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                        background: "rgba(255,255,255,0.03)",
                      }}>
                      {item.url && !item.url.startsWith("blob:") ? (
                        <img
                          src={item.url}
                          alt="history"
                          style={{
                            width: "100%",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "80px",
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                          <Sparkles size={16} color="#aaa" />
                        </div>
                      )}
                      <p
                        style={{
                          fontSize: "0.7rem",
                          color: "#aaa",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                        {item.prompt}
                      </p>
                    </motion.div>
                  ))}
                  <button
                    onClick={() => {
                      setHistory([]);
                      localStorage.removeItem("imgHistory");
                    }}
                    style={{
                      minWidth: "40px",
                      background: "rgba(255,0,0,0.2)",
                      border: "none",
                      borderRadius: "10px",
                      color: "#ff8888",
                      cursor: "pointer",
                    }}
                    title="Clear History">
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {loading && (
          <motion.div
            className="loader-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <div className="spinner"></div>
            <p className="loader-text">AI is dreaming...</p>
            <motion.p
              key={currentHint}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                fontSize: "0.8rem",
                color: "var(--primary)",
                marginTop: "10px",
                fontStyle: "italic",
                maxWidth: "80%",
              }}>
              {currentHint}
            </motion.p>
          </motion.div>
        )}

        {imgError && (
          <motion.div
            className="glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              padding: "20px",
              marginTop: "20px",
              borderColor: "#ff4444",
              textAlign: "center",
            }}>
            <AlertCircle
              size={40}
              color="#ff4444"
              style={{ marginBottom: "10px" }}
            />
            <h3 style={{ color: "#ff4444", margin: "0 0 5px 0" }}>
              Generation Failed
            </h3>
            <p style={{ margin: 0, color: "#aaa" }}>
              Our AI servers are currently overloaded. Please try again in a few
              moments.
            </p>
          </motion.div>
        )}

        {imageUrl && !loading && !imgError && (
          <motion.div
            className="image-result"
            initial={{ opacity: 0, scale: 0.8, rotateX: -15 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ type: "spring", damping: 15 }}
            style={{
              perspective: 1000,
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              const rotateX = (y - centerY) / 20;
              const rotateY = (centerX - x) / 20;
              e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
            }}>
            <div
              className="glass-panel"
              style={{ padding: "10px", paddingBottom: "0" }}>
              <img
                src={imageUrl}
                alt="Generated Art"
                className="generated-image"
                onError={() => setImgError(true)}
              />
              <div className="image-actions">
                <motion.button
                  className="action-btn"
                  onClick={handleDownload}
                  whileHover={{ scale: 1.1 }}
                  title="Download">
                  <Download size={20} />
                </motion.button>
                <motion.button
                  className="action-btn"
                  whileHover={{ scale: 1.1 }}
                  title="View Fullscreen"
                  onClick={() => window.open(imageUrl, "_blank")}>
                  <ImageIcon size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
