<template>
    <form @submit.prevent="handleSubmit" :aria-labelledby="titleId" :aria-describedby="descriptionId" class="space-y-6"
        novalidate>
        <!-- Form Title -->
        <div v-if="title || description">
            <h2 v-if="title" :id="titleId" class="text-2xl font-bold text-text-primary mb-2">
                {{ title }}
            </h2>
            <p v-if="description" :id="descriptionId" class="text-text-secondary">
                {{ description }}
            </p>
        </div>

        <!-- Form Fields -->
        <div class="space-y-4">
            <slot />
        </div>

        <!-- Form Actions -->
        <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-secondary-200">
            <button type="submit" :disabled="loading || !isValid" class="btn btn-primary flex-1 sm:flex-none"
                :aria-describedby="loading ? 'submit-status' : undefined">
                <span v-if="loading" id="submit-status" class="sr-only">{{ loadingText }}</span>
                <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                {{ loading ? loadingText : submitText }}
            </button>

            <button v-if="showCancel" type="button" @click="handleCancel" class="btn btn-secondary flex-1 sm:flex-none"
                :disabled="loading">
                {{ cancelText }}
            </button>

            <button v-if="showSave" type="button" @click="handleSave" class="btn btn-accent flex-1 sm:flex-none"
                :disabled="loading">
                {{ saveText }}
            </button>
        </div>

        <!-- Form Status Messages -->
        <div v-if="errorMessage" class="bg-error-50 border border-error-200 rounded-md p-4" role="alert">
            <div class="flex">
                <svg class="h-5 w-5 text-error-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        clip-rule="evenodd" />
                </svg>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-error-800">
                        Error
                    </h3>
                    <div class="mt-2 text-sm text-error-700">
                        {{ errorMessage }}
                    </div>
                </div>
            </div>
        </div>

        <div v-if="successMessage" class="bg-success-50 border border-success-200 rounded-md p-4" role="alert">
            <div class="flex">
                <svg class="h-5 w-5 text-success-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.53a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clip-rule="evenodd" />
                </svg>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-success-800">
                        Success
                    </h3>
                    <div class="mt-2 text-sm text-success-700">
                        {{ successMessage }}
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<script setup>
const props = defineProps({
    title: String,
    description: String,
    submitText: {
        type: String,
        default: 'Submit'
    },
    loadingText: {
        type: String,
        default: 'Submitting...'
    },
    cancelText: {
        type: String,
        default: 'Cancel'
    },
    saveText: {
        type: String,
        default: 'Save Draft'
    },
    showCancel: {
        type: Boolean,
        default: false
    },
    showSave: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    },
    isValid: {
        type: Boolean,
        default: true
    },
    errorMessage: String,
    successMessage: String
})

const emit = defineEmits(['submit', 'cancel', 'save'])

// Generate unique IDs for accessibility
const titleId = computed(() => `form-title-${Math.random().toString(36).substr(2, 9)}`)
const descriptionId = computed(() => `form-description-${Math.random().toString(36).substr(2, 9)}`)

const { announce, ttsEnabled } = useAccessibility()

// Form handlers
const handleSubmit = () => {
    if (props.loading || !props.isValid) return

    if (ttsEnabled.value) {
        announce('Submitting form', 'assertive')
    }

    emit('submit')
}

const handleCancel = () => {
    if (props.loading) return

    if (ttsEnabled.value) {
        announce('Form cancelled', 'polite')
    }

    emit('cancel')
}

const handleSave = () => {
    if (props.loading) return

    if (ttsEnabled.value) {
        announce('Saving draft', 'polite')
    }

    emit('save')
}

// Watch for status changes and announce them
watch(() => props.errorMessage, (newError) => {
    if (newError && ttsEnabled.value) {
        announce(`Error: ${newError}`, 'assertive')
    }
})

watch(() => props.successMessage, (newSuccess) => {
    if (newSuccess && ttsEnabled.value) {
        announce(`Success: ${newSuccess}`, 'polite')
    }
})

// Enhance form fields when component mounts
onMounted(() => {
    const { enhanceFormFields } = useAccessibility()
    nextTick(() => {
        enhanceFormFields()
    })
})
</script>