/**
 * Clinical Field Notebook design: voice is an optional instrument, never a gate.
 * Text input remains the fully supported path for accessibility and evaluator reliability.
 */

import { useEffect, useRef, useState } from "react";

interface SpeechRecognitionEventLike {
  results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>;
}

interface SpeechRecognitionErrorLike {
  error: string;
}

interface RecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => RecognitionLike;
    webkitSpeechRecognition?: new () => RecognitionLike;
  }
}

export function useSpeech() {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<RecognitionLike | null>(null);
  const Recognition = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : undefined;

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const listen = (onFinal: (text: string) => void) => {
    if (!Recognition || listening) return;
    setError(null);
    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join(" ")
        .trim();
      if (transcript) onFinal(transcript);
    };
    recognition.onerror = (event) => {
      setError(event.error === "not-allowed" ? "Microphone permission was not granted. Use text or a scripted scenario." : `Voice input stopped: ${event.error}.`);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  const stop = () => recognitionRef.current?.stop();

  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  return {
    inputSupported: Boolean(Recognition),
    outputSupported: typeof window !== "undefined" && "speechSynthesis" in window,
    listening,
    error,
    listen,
    stop,
    speak,
  };
}

