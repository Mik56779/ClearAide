<template>
    <div class="flex items-center space-x-2">
        <!-- TTS Toggle -->
        <button @click="toggleTTS" :class="[
            'p-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500',
            ttsEnabled ? 'bg-accent-100 text-accent-700 hover:bg-accent-200' : 'bg-secondary-100 text-text-secondary hover:bg-secondary-200'
        ]" :aria-pressed="ttsEnabled" :aria-label="ttsEnabled ? 'Disable text-to-speech' : 'Enable text-to-speech'"
            title="Toggle text-to-speech">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
        </button>

        <!-- STT Toggle -->
        <button @click="toggleSTT" :class="[
            'p-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500',
            sttEnabled ? 'bg-accent-100 text-accent-700 hover:bg-accent-200' : 'bg-secondary-100 text-text-secondary hover:bg-secondary-200'
        ]" :aria-pressed="sttEnabled" :aria-label="sttEnabled ? 'Disable speech-to-text' : 'Enable speech-to-text'"
            title="Toggle speech-to-text">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
            </svg>
        </button>

        <!-- High Contrast Toggle -->
        <button @click="toggleHighContrast" :class="[
            'p-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500',
            highContrastEnabled ? 'bg-accent-100 text-accent-700 hover:bg-accent-200' : 'bg-secondary-100 text-text-secondary hover:bg-secondary-200'
        ]" :aria-pressed="highContrastEnabled"
            :aria-label="highContrastEnabled ? 'Disable high contrast mode' : 'Enable high contrast mode'"
            title="Toggle high contrast mode">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
        </button>

        <!-- Accessibility Settings -->
        <button @click="showSettings = !showSettings"
            class="p-2 rounded-md bg-secondary-100 text-text-secondary hover:bg-secondary-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500"
            :aria-expanded="showSettings" aria-label="Open accessibility settings" title="Accessibility settings">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
            </svg>
        </button>

        <!-- Settings Panel -->
        <div v-if="showSettings"
            class="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-secondary-200 p-4 z-50"
            role="dialog" aria-labelledby="settings-title" @click.stop>
            <h3 id="settings-title" class="text-lg font-semibold text-text-primary mb-4">
                Accessibility Settings
            </h3>

            <div class="space-y-4">
                <!-- TTS Settings -->
                <div>
                    <h4 class="text-sm font-medium text-text-primary mb-2">Text-to-Speech</h4>
                    <div class="space-y-2">
                        <div>
                            <label for="tts-voice" class="block text-xs text-text-secondary mb-1">Voice</label>
                            <select id="tts-voice" v-model="ttsVoice"
                                class="w-full text-sm border border-secondary-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent-500"
                                @change="updateTTSSettings">
                                <option value="default">Default</option>
                                <option value="male">Male Voice</option>
                                <option value="female">Female Voice</option>
                            </select>
                        </div>
                        <div>
                            <label for="tts-speed" class="block text-xs text-text-secondary mb-1">
                                Speed: {{ ttsSpeed }}x
                            </label>
                            <input id="tts-speed" v-model.number="ttsSpeed" type="range" min="0.5" max="2" step="0.1"
                                class="w-full" @input="updateTTSSettings" />
                        </div>
                    </div>
                </div>

                <!-- STT Settings -->
                <div>
                    <h4 class="text-sm font-medium text-text-primary mb-2">Speech-to-Text</h4>
                    <div class="space-y-2">
                        <div>
                            <label for="stt-language" class="block text-xs text-text-secondary mb-1">Language</label>
                            <select id="stt-language" v-model="sttLanguage"
                                class="w-full text-sm border border-secondary-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent-500"
                                @change="updateSTTSettings">
                                <option value="en-US">English (US)</option>
                                <option value="en-GB">English (UK)</option>
                                <option value="es-ES">Spanish</option>
                                <option value="fr-FR">French</option>
                            </select>
                        </div>
                        <div class="flex items-center">
                            <input id="stt-auto-punctuation" v-model="sttAutoPunctuation" type="checkbox"
                                class="h-4 w-4 text-accent-600 focus:ring-accent-500 border-secondary-300 rounded"
                                @change="updateSTTSettings" />
                            <label for="stt-auto-punctuation" class="ml-2 text-xs text-text-secondary">
                                Auto punctuation
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Visual Settings -->
                <div>
                    <h4 class="text-sm font-medium text-text-primary mb-2">Visual</h4>
                    <div class="space-y-2">
                        <div class="flex items-center">
                            <input id="large-text" v-model="largeTextEnabled" type="checkbox"
                                class="h-4 w-4 text-accent-600 focus:ring-accent-500 border-secondary-300 rounded"
                                @change="updateVisualSettings" />
                            <label for="large-text" class="ml-2 text-xs text-text-secondary">
                                Large text mode
                            </label>
                        </div>
                        <div class="flex items-center">
                            <input id="reduced-motion" v-model="reducedMotionEnabled" type="checkbox"
                                class="h-4 w-4 text-accent-600 focus:ring-accent-500 border-secondary-300 rounded"
                                @change="updateVisualSettings" />
                            <label for="reduced-motion" class="ml-2 text-xs text-text-secondary">
                                Reduced motion
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-4 pt-4 border-t border-secondary-200">
                <button @click="showSettings = false" class="w-full btn btn-primary text-sm">
                    Close Settings
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const { $accessibility } = useNuxtApp()

// Reactive state
const showSettings = ref(false)
const ttsEnabled = ref(false)
const sttEnabled = ref(false)
const highContrastEnabled = ref(false)
const largeTextEnabled = ref(false)
const reducedMotionEnabled = ref(false)

// TTS Settings
const ttsVoice = ref('default')
const ttsSpeed = ref(1.0)

// STT Settings
const sttLanguage = ref('en-US')
const sttAutoPunctuation = ref(true)

// Initialize accessibility features
onMounted(async () => {
    if (process.client) {
        // Load saved settings
        await loadAccessibilitySettings()

        // Initialize TTS and STT
        initializeTTS()
        initializeSTT()

        // Apply visual settings
        applyVisualSettings()
    }
})

// Load accessibility settings from localStorage or user profile
const loadAccessibilitySettings = async () => {
    try {
        const saved = localStorage.getItem('accessibility-settings')
        if (saved) {
            const settings = JSON.parse(saved)
            ttsEnabled.value = settings.ttsEnabled || false
            sttEnabled.value = settings.sttEnabled || false
            highContrastEnabled.value = settings.highContrastEnabled || false
            largeTextEnabled.value = settings.largeTextEnabled || false
            reducedMotionEnabled.value = settings.reducedMotionEnabled || false
            ttsVoice.value = settings.ttsVoice || 'default'
            ttsSpeed.value = settings.ttsSpeed || 1.0
            sttLanguage.value = settings.sttLanguage || 'en-US'
            sttAutoPunctuation.value = settings.sttAutoPunctuation !== false
        }
    } catch (error) {
        console.error('Error loading accessibility settings:', error)
    }
}

// Save accessibility settings
const saveAccessibilitySettings = () => {
    try {
        const settings = {
            ttsEnabled: ttsEnabled.value,
            sttEnabled: sttEnabled.value,
            highContrastEnabled: highContrastEnabled.value,
            largeTextEnabled: largeTextEnabled.value,
            reducedMotionEnabled: reducedMotionEnabled.value,
            ttsVoice: ttsVoice.value,
            ttsSpeed: ttsSpeed.value,
            sttLanguage: sttLanguage.value,
            sttAutoPunctuation: sttAutoPunctuation.value
        }
        localStorage.setItem('accessibility-settings', JSON.stringify(settings))
    } catch (error) {
        console.error('Error saving accessibility settings:', error)
    }
}

// TTS Functions
const initializeTTS = () => {
    if ('speechSynthesis' in window) {
        // TTS is supported
        console.log('Text-to-Speech is supported')
    } else {
        console.warn('Text-to-Speech is not supported in this browser')
    }
}

const toggleTTS = () => {
    ttsEnabled.value = !ttsEnabled.value
    saveAccessibilitySettings()

    if (ttsEnabled.value) {
        speak('Text-to-speech enabled')
    }
}

const speak = (text) => {
    if (!ttsEnabled.value || !('speechSynthesis' in window)) return

    // Cancel any ongoing speech
    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = ttsSpeed.value
    utterance.volume = 1.0

    // Set voice based on preference
    const voices = speechSynthesis.getVoices()
    if (voices.length > 0) {
        if (ttsVoice.value === 'male') {
            const maleVoice = voices.find(voice => voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('david') || voice.name.toLowerCase().includes('alex'))
            if (maleVoice) utterance.voice = maleVoice
        } else if (ttsVoice.value === 'female') {
            const femaleVoice = voices.find(voice => voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('samantha') || voice.name.toLowerCase().includes('victoria'))
            if (femaleVoice) utterance.voice = femaleVoice
        }
    }

    speechSynthesis.speak(utterance)
}

const updateTTSSettings = () => {
    saveAccessibilitySettings()
    if (ttsEnabled.value) {
        speak('Text-to-speech settings updated')
    }
}

// STT Functions
const initializeSTT = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        console.log('Speech-to-Text is supported')
    } else {
        console.warn('Speech-to-Text is not supported in this browser')
    }
}

const toggleSTT = () => {
    sttEnabled.value = !sttEnabled.value
    saveAccessibilitySettings()

    if (sttEnabled.value) {
        speak('Speech-to-text enabled. You can now use voice input in form fields.')
    } else {
        speak('Speech-to-text disabled')
    }
}

const updateSTTSettings = () => {
    saveAccessibilitySettings()
    if (ttsEnabled.value) {
        speak('Speech-to-text settings updated')
    }
}

// Visual accessibility functions
const toggleHighContrast = () => {
    highContrastEnabled.value = !highContrastEnabled.value
    applyVisualSettings()
    saveAccessibilitySettings()

    if (ttsEnabled.value) {
        speak(highContrastEnabled.value ? 'High contrast mode enabled' : 'High contrast mode disabled')
    }
}

const updateVisualSettings = () => {
    applyVisualSettings()
    saveAccessibilitySettings()
}

const applyVisualSettings = () => {
    const html = document.documentElement

    // High contrast mode
    if (highContrastEnabled.value) {
        html.classList.add('high-contrast')
    } else {
        html.classList.remove('high-contrast')
    }

    // Large text mode
    if (largeTextEnabled.value) {
        html.classList.add('large-text')
    } else {
        html.classList.remove('large-text')
    }

    // Reduced motion
    if (reducedMotionEnabled.value) {
        html.classList.add('reduced-motion')
    } else {
        html.classList.remove('reduced-motion')
    }
}

// Close settings when clicking outside
onMounted(() => {
    const handleClickOutside = (event) => {
        if (showSettings.value && !event.target.closest('[role="dialog"]') && !event.target.closest('button[aria-expanded]')) {
            showSettings.value = false
        }
    }

    document.addEventListener('click', handleClickOutside)

    onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside)
    })
})

// Provide TTS function globally
provide('speak', speak)
provide('ttsEnabled', readonly(ttsEnabled))
provide('sttEnabled', readonly(sttEnabled))
</script>

<style scoped>
/* Additional styles for high contrast mode */
:global(.high-contrast) {
    filter: contrast(150%);
}

:global(.large-text) {
    font-size: 1.2em;
}

:global(.reduced-motion *) {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
}
</style>