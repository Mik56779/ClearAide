// Accessibility composable for TTS/STT functionality
export const useAccessibility = () => {
  const ttsEnabled = ref(false);
  const sttEnabled = ref(false);
  const currentRecognition = ref(null);

  // Initialize accessibility features
  const initializeAccessibility = () => {
    if (process.client) {
      loadSettings();
      initializeSpeechRecognition();
    }
  };

  // Load settings from localStorage
  const loadSettings = () => {
    try {
      const saved = localStorage.getItem("accessibility-settings");
      if (saved) {
        const settings = JSON.parse(saved);
        ttsEnabled.value = settings.ttsEnabled || false;
        sttEnabled.value = settings.sttEnabled || false;
      }
    } catch (error) {
      console.error("Error loading accessibility settings:", error);
    }
  };

  // Text-to-Speech functionality
  const speak = (text, options = {}) => {
    if (!ttsEnabled.value || !("speechSynthesis" in window) || !text) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1.0;
    utterance.volume = options.volume || 1.0;
    utterance.pitch = options.pitch || 1.0;

    // Set voice if specified
    if (options.voice) {
      const voices = speechSynthesis.getVoices();
      const selectedVoice = voices.find(
        (voice) => voice.name === options.voice
      );
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    speechSynthesis.speak(utterance);
  };

  // Announce important messages for screen readers and TTS
  const announce = (message, priority = "polite") => {
    // Create a live region for screen readers
    const liveRegion = document.createElement("div");
    liveRegion.setAttribute("aria-live", priority);
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.className = "sr-only";
    liveRegion.textContent = message;

    document.body.appendChild(liveRegion);

    // Also speak the message if TTS is enabled
    if (ttsEnabled.value) {
      speak(message);
    }

    // Remove the live region after announcement
    setTimeout(() => {
      document.body.removeChild(liveRegion);
    }, 1000);
  };

  // Speech-to-Text functionality
  const initializeSpeechRecognition = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      console.warn("Speech recognition not supported");
      return null;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    return recognition;
  };

  // Start speech recognition for a specific input element
  const startSpeechRecognition = (inputElement, options = {}) => {
    if (!sttEnabled.value || !inputElement) return;

    const recognition = initializeSpeechRecognition();
    if (!recognition) return;

    // Configure recognition
    recognition.lang = options.language || "en-US";
    recognition.continuous = options.continuous || false;
    recognition.interimResults = options.interimResults !== false;

    let finalTranscript = "";
    let interimTranscript = "";

    recognition.onstart = () => {
      announce("Listening for speech input", "assertive");
      inputElement.classList.add("listening");
    };

    recognition.onresult = (event) => {
      finalTranscript = "";
      interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Update input value
      if (finalTranscript) {
        const currentValue = inputElement.value;
        const newValue = options.append
          ? currentValue + " " + finalTranscript
          : finalTranscript;
        inputElement.value = newValue;

        // Trigger input event for Vue reactivity
        inputElement.dispatchEvent(new Event("input", { bubbles: true }));

        // Auto-punctuation if enabled
        if (options.autoPunctuation !== false) {
          inputElement.value = addAutoPunctuation(inputElement.value);
          inputElement.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }

      // Show interim results
      if (interimTranscript && options.showInterim !== false) {
        inputElement.placeholder = interimTranscript;
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      announce("Speech recognition error: " + event.error, "assertive");
      inputElement.classList.remove("listening");
    };

    recognition.onend = () => {
      announce("Speech input completed", "polite");
      inputElement.classList.remove("listening");
      inputElement.placeholder = "";
    };

    currentRecognition.value = recognition;
    recognition.start();
  };

  // Stop current speech recognition
  const stopSpeechRecognition = () => {
    if (currentRecognition.value) {
      currentRecognition.value.stop();
      currentRecognition.value = null;
    }
  };

  // Add basic auto-punctuation
  const addAutoPunctuation = (text) => {
    return text
      .replace(/\s+/g, " ") // Normalize whitespace
      .replace(/\b(period|dot)\b/gi, ".")
      .replace(/\b(comma)\b/gi, ",")
      .replace(/\b(question mark)\b/gi, "?")
      .replace(/\b(exclamation mark|exclamation point)\b/gi, "!")
      .replace(/\b(semicolon)\b/gi, ";")
      .replace(/\b(colon)\b/gi, ":")
      .replace(/\b(new line|new paragraph)\b/gi, "\n")
      .trim();
  };

  // Add speech input button to form fields
  const addSpeechInputButton = (inputElement) => {
    if (!sttEnabled.value || inputElement.dataset.speechButton) return;

    // Mark as having speech button
    inputElement.dataset.speechButton = "true";

    // Create speech button
    const button = document.createElement("button");
    button.type = "button";
    button.className = "speech-input-btn";
    button.innerHTML = `
      <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
      </svg>
    `;
    button.setAttribute("aria-label", "Use voice input");
    button.setAttribute("title", "Click to use voice input");

    // Style the button
    button.style.cssText = `
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      color: #6b7280;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: color 0.2s;
    `;

    // Add hover effect
    button.addEventListener("mouseenter", () => {
      button.style.color = "#059669";
    });
    button.addEventListener("mouseleave", () => {
      button.style.color = "#6b7280";
    });

    // Add click handler
    button.addEventListener("click", (e) => {
      e.preventDefault();
      startSpeechRecognition(inputElement);
    });

    // Position input container relatively
    const container = inputElement.parentElement;
    if (container && getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }

    // Add button to container
    container.appendChild(button);
  };

  // Auto-enhance form fields with speech input
  const enhanceFormFields = () => {
    if (!sttEnabled.value) return;

    const inputs = document.querySelectorAll(
      'input[type="text"], input[type="email"], textarea'
    );
    inputs.forEach((input) => {
      addSpeechInputButton(input);
    });
  };

  // Focus management for accessibility
  const manageFocus = (element) => {
    if (!element) return;

    element.focus();

    // Announce focus change for screen readers
    const label =
      element.getAttribute("aria-label") ||
      element.getAttribute("placeholder") ||
      element.getAttribute("title") ||
      "Form field";

    announce(`Focused on ${label}`, "polite");
  };

  // Keyboard navigation helpers
  const handleKeyboardNavigation = (event, options = {}) => {
    const { onEnter, onEscape, onTab, onArrow } = options;

    switch (event.key) {
      case "Enter":
        if (onEnter) {
          event.preventDefault();
          onEnter(event);
        }
        break;
      case "Escape":
        if (onEscape) {
          event.preventDefault();
          onEscape(event);
        }
        break;
      case "Tab":
        if (onTab) {
          onTab(event);
        }
        break;
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight":
        if (onArrow) {
          onArrow(event);
        }
        break;
    }
  };

  return {
    ttsEnabled: readonly(ttsEnabled),
    sttEnabled: readonly(sttEnabled),
    initializeAccessibility,
    speak,
    announce,
    startSpeechRecognition,
    stopSpeechRecognition,
    addSpeechInputButton,
    enhanceFormFields,
    manageFocus,
    handleKeyboardNavigation,
  };
};
