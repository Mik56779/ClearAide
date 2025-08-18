// Accessibility plugin for global initialization
export default defineNuxtPlugin(() => {
  const { initializeAccessibility, enhanceFormFields, announce } =
    useAccessibility();

  // Initialize accessibility features when the app starts
  initializeAccessibility();

  // Enhance form fields with speech input when DOM is ready
  onMounted(() => {
    enhanceFormFields();

    // Re-enhance form fields when new content is added
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const inputs = node.querySelectorAll
                ? node.querySelectorAll(
                    'input[type="text"], input[type="email"], textarea'
                  )
                : [];
              inputs.forEach((input) => {
                const { addSpeechInputButton, sttEnabled } = useAccessibility();
                if (sttEnabled.value) {
                  addSpeechInputButton(input);
                }
              });
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup observer on unmount
    onUnmounted(() => {
      observer.disconnect();
    });
  });

  // Global keyboard shortcuts for accessibility
  const handleGlobalKeyboard = (event) => {
    // Alt + T: Toggle TTS
    if (event.altKey && event.key === "t") {
      event.preventDefault();
      const controls = document.querySelector('[aria-label*="text-to-speech"]');
      if (controls) {
        controls.click();
      }
    }

    // Alt + S: Toggle STT
    if (event.altKey && event.key === "s") {
      event.preventDefault();
      const controls = document.querySelector('[aria-label*="speech-to-text"]');
      if (controls) {
        controls.click();
      }
    }

    // Alt + H: Toggle high contrast
    if (event.altKey && event.key === "h") {
      event.preventDefault();
      const controls = document.querySelector('[aria-label*="high contrast"]');
      if (controls) {
        controls.click();
      }
    }

    // Alt + A: Open accessibility settings
    if (event.altKey && event.key === "a") {
      event.preventDefault();
      const settings = document.querySelector(
        '[aria-label*="accessibility settings"]'
      );
      if (settings) {
        settings.click();
      }
    }
  };

  // Add global keyboard event listener
  if (process.client) {
    document.addEventListener("keydown", handleGlobalKeyboard);

    // Announce keyboard shortcuts on first load
    setTimeout(() => {
      announce(
        "Accessibility shortcuts: Alt+T for text-to-speech, Alt+S for speech-to-text, Alt+H for high contrast, Alt+A for settings",
        "polite"
      );
    }, 2000);
  }

  // Provide accessibility utilities globally
  return {
    provide: {
      accessibility: {
        announce,
        enhanceFormFields,
      },
    },
  };
});
