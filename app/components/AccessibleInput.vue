<template>
    <div class="space-y-1">
        <!-- Label -->
        <label v-if="label" :for="inputId" class="form-label" :class="{ 'text-error-600': hasError }">
            {{ label }}
            <span v-if="required" class="text-error-500 ml-1" aria-label="required">*</span>
        </label>

        <!-- Input Container -->
        <div class="relative">
            <!-- Text Input -->
            <input v-if="type !== 'textarea' && type !== 'select'" :id="inputId" ref="inputRef" :type="type"
                :value="modelValue" :placeholder="placeholder" :required="required" :disabled="disabled"
                :readonly="readonly" :autocomplete="autocomplete" :aria-describedby="ariaDescribedBy"
                :aria-invalid="hasError" :aria-required="required" class="form-input" :class="[
                    { 'border-error-500 focus:border-error-500 focus:ring-error-500': hasError },
                    { 'bg-secondary-50 cursor-not-allowed': disabled },
                    { 'pr-10': showSpeechButton }
                ]" @input="handleInput" @blur="handleBlur" @focus="handleFocus" @keydown="handleKeydown" />

            <!-- Textarea -->
            <textarea v-else-if="type === 'textarea'" :id="inputId" ref="inputRef" :value="modelValue"
                :placeholder="placeholder" :required="required" :disabled="disabled" :readonly="readonly" :rows="rows"
                :aria-describedby="ariaDescribedBy" :aria-invalid="hasError" :aria-required="required"
                class="form-input" :class="[
                    { 'border-error-500 focus:border-error-500 focus:ring-error-500': hasError },
                    { 'bg-secondary-50 cursor-not-allowed': disabled },
                    { 'pr-10': showSpeechButton }
                ]" @input="handleInput" @blur="handleBlur" @focus="handleFocus" @keydown="handleKeydown"></textarea>

            <!-- Select -->
            <select v-else-if="type === 'select'" :id="inputId" ref="inputRef" :value="modelValue" :required="required"
                :disabled="disabled" :aria-describedby="ariaDescribedBy" :aria-invalid="hasError"
                :aria-required="required" class="form-input" :class="[
                    { 'border-error-500 focus:border-error-500 focus:ring-error-500': hasError },
                    { 'bg-secondary-50 cursor-not-allowed': disabled }
                ]" @change="handleInput" @blur="handleBlur" @focus="handleFocus">
                <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
                <option v-for="option in options" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </select>

            <!-- Speech Input Button -->
            <button v-if="showSpeechButton" type="button"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-secondary-400 hover:text-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-500 rounded"
                :class="{ 'text-accent-600 animate-pulse': isListening }"
                :aria-label="isListening ? 'Stop voice input' : 'Start voice input'"
                :title="isListening ? 'Stop voice input' : 'Start voice input'" @click="toggleSpeechInput">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                        d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
                </svg>
            </button>
        </div>

        <!-- Help Text -->
        <div v-if="helpText" :id="helpId" class="text-sm text-text-secondary">
            {{ helpText }}
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" :id="errorId" class="form-error" role="alert">
            {{ errorMessage }}
        </div>

        <!-- Character Count -->
        <div v-if="showCharCount && maxLength" class="text-xs text-text-secondary text-right">
            {{ characterCount }}/{{ maxLength }}
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: [String, Number],
    type: {
        type: String,
        default: 'text'
    },
    label: String,
    placeholder: String,
    helpText: String,
    errorMessage: String,
    required: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    autocomplete: String,
    rows: {
        type: Number,
        default: 3
    },
    maxLength: Number,
    showCharCount: Boolean,
    options: {
        type: Array,
        default: () => []
    },
    enableSpeechInput: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

// Refs
const inputRef = ref(null)
const isListening = ref(false)

// Computed properties
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)
const helpId = computed(() => `${inputId.value}-help`)
const errorId = computed(() => `${inputId.value}-error`)

const hasError = computed(() => !!props.errorMessage)

const ariaDescribedBy = computed(() => {
    const ids = []
    if (props.helpText) ids.push(helpId.value)
    if (props.errorMessage) ids.push(errorId.value)
    return ids.length > 0 ? ids.join(' ') : undefined
})

const characterCount = computed(() => {
    return props.modelValue ? props.modelValue.toString().length : 0
})

const { sttEnabled, startSpeechRecognition, stopSpeechRecognition, announce, ttsEnabled } = useAccessibility()

const showSpeechButton = computed(() => {
    return props.enableSpeechInput &&
        sttEnabled.value &&
        (props.type === 'text' || props.type === 'textarea') &&
        !props.disabled &&
        !props.readonly
})

// Event handlers
const handleInput = (event) => {
    const value = event.target.value

    // Validate max length
    if (props.maxLength && value.length > props.maxLength) {
        return
    }

    emit('update:modelValue', value)
}

const handleBlur = (event) => {
    emit('blur', event)
}

const handleFocus = (event) => {
    // Announce field focus for screen readers
    if (ttsEnabled.value && props.label) {
        announce(`Focused on ${props.label}${props.required ? ', required field' : ''}`, 'polite')
    }

    emit('focus', event)
}

const handleKeydown = (event) => {
    // Handle speech input shortcut (Ctrl/Cmd + Shift + S)
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'S') {
        event.preventDefault()
        toggleSpeechInput()
    }
}

// Speech input functionality
const toggleSpeechInput = () => {
    if (!showSpeechButton.value) return

    if (isListening.value) {
        stopSpeechInput()
    } else {
        startSpeechInput()
    }
}

const startSpeechInput = () => {
    if (!inputRef.value || isListening.value) return

    isListening.value = true

    startSpeechRecognition(inputRef.value, {
        language: 'en-US',
        continuous: false,
        interimResults: true,
        autoPunctuation: true,
        append: props.type === 'textarea' && props.modelValue
    })

    // Listen for recognition end
    const checkRecognitionEnd = () => {
        if (!inputRef.value.classList.contains('listening')) {
            isListening.value = false
        } else {
            setTimeout(checkRecognitionEnd, 100)
        }
    }

    setTimeout(checkRecognitionEnd, 100)
}

const stopSpeechInput = () => {
    stopSpeechRecognition()
    isListening.value = false
}

// Watch for error changes and announce them
watch(() => props.errorMessage, (newError, oldError) => {
    if (newError && newError !== oldError && ttsEnabled.value) {
        announce(`Error in ${props.label || 'field'}: ${newError}`, 'assertive')
    }
})

// Focus method for external use
const focus = () => {
    if (inputRef.value) {
        inputRef.value.focus()
    }
}

// Expose focus method
defineExpose({
    focus
})
</script>

<style scoped>
/* Listening state styles */
.listening {
    @apply ring-2 ring-accent-500 border-accent-500;
}

/* Speech button animation */
@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>