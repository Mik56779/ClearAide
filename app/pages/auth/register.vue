<template>
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h1 class="mt-6 text-center text-3xl font-extrabold text-text-primary">
                    Create your account
                </h1>
                <p class="mt-2 text-center text-sm text-text-secondary">
                    Get started with accessible tax filing and health insurance
                </p>
            </div>

            <form @submit.prevent="signUp" class="mt-8 space-y-6" novalidate>
                <div class="space-y-4">
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label for="first-name" class="form-label">
                                First name
                            </label>
                            <input id="first-name" v-model="firstName" type="text" autocomplete="given-name" required
                                class="form-input"
                                :class="{ 'border-error-500 focus:border-error-500 focus:ring-error-500': firstNameError }"
                                aria-describedby="first-name-error" @blur="validateFirstName" />
                            <div v-if="firstNameError" id="first-name-error" class="form-error" role="alert">
                                {{ firstNameError }}
                            </div>
                        </div>

                        <div>
                            <label for="last-name" class="form-label">
                                Last name
                            </label>
                            <input id="last-name" v-model="lastName" type="text" autocomplete="family-name" required
                                class="form-input"
                                :class="{ 'border-error-500 focus:border-error-500 focus:ring-error-500': lastNameError }"
                                aria-describedby="last-name-error" @blur="validateLastName" />
                            <div v-if="lastNameError" id="last-name-error" class="form-error" role="alert">
                                {{ lastNameError }}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label for="email" class="form-label">
                            Email address
                        </label>
                        <input id="email" v-model="email" type="email" autocomplete="email" required class="form-input"
                            :class="{ 'border-error-500 focus:border-error-500 focus:ring-error-500': emailError }"
                            aria-describedby="email-error email-help" @blur="validateEmail" />
                        <div id="email-help" class="mt-1 text-sm text-text-secondary">
                            We'll use this to send you important updates about your applications.
                        </div>
                        <div v-if="emailError" id="email-error" class="form-error" role="alert">
                            {{ emailError }}
                        </div>
                    </div>

                    <div>
                        <label for="password" class="form-label">
                            Password
                        </label>
                        <input id="password" v-model="password" type="password" autocomplete="new-password" required
                            class="form-input"
                            :class="{ 'border-error-500 focus:border-error-500 focus:ring-error-500': passwordError }"
                            aria-describedby="password-error password-help" @blur="validatePassword" />
                        <div id="password-help" class="mt-1 text-sm text-text-secondary">
                            Must be at least 8 characters with uppercase, lowercase, and number.
                        </div>
                        <div v-if="passwordError" id="password-error" class="form-error" role="alert">
                            {{ passwordError }}
                        </div>
                    </div>

                    <div>
                        <label for="confirm-password" class="form-label">
                            Confirm password
                        </label>
                        <input id="confirm-password" v-model="confirmPassword" type="password"
                            autocomplete="new-password" required class="form-input"
                            :class="{ 'border-error-500 focus:border-error-500 focus:ring-error-500': confirmPasswordError }"
                            aria-describedby="confirm-password-error" @blur="validateConfirmPassword" />
                        <div v-if="confirmPasswordError" id="confirm-password-error" class="form-error" role="alert">
                            {{ confirmPasswordError }}
                        </div>
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="flex items-start">
                        <div class="flex items-center h-5">
                            <input id="accessibility-needs" v-model="hasAccessibilityNeeds" type="checkbox"
                                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded" />
                        </div>
                        <div class="ml-3 text-sm">
                            <label for="accessibility-needs" class="font-medium text-text-primary">
                                I have accessibility needs
                            </label>
                            <p class="text-text-secondary">
                                Check this to enable enhanced accessibility features like screen reader optimization and
                                voice controls.
                            </p>
                        </div>
                    </div>

                    <div class="flex items-start">
                        <div class="flex items-center h-5">
                            <input id="terms" v-model="acceptTerms" type="checkbox" required
                                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                                :class="{ 'border-error-500 focus:border-error-500 focus:ring-error-500': termsError }"
                                aria-describedby="terms-error" @change="validateTerms" />
                        </div>
                        <div class="ml-3 text-sm">
                            <label for="terms" class="font-medium text-text-primary">
                                I agree to the
                                <a href="/terms" class="text-primary-600 hover:text-primary-500 underline"
                                    target="_blank">
                                    Terms of Service
                                </a>
                                and
                                <a href="/privacy" class="text-primary-600 hover:text-primary-500 underline"
                                    target="_blank">
                                    Privacy Policy
                                </a>
                            </label>
                            <div v-if="termsError" id="terms-error" class="form-error" role="alert">
                                {{ termsError }}
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="error" class="bg-error-50 border border-error-200 rounded-md p-4" role="alert">
                    <div class="flex">
                        <svg class="h-5 w-5 text-error-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                                clip-rule="evenodd" />
                        </svg>
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-error-800">
                                Registration failed
                            </h3>
                            <div class="mt-2 text-sm text-error-700">
                                {{ error }}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <button type="submit" :disabled="loading || !isFormValid"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        :aria-describedby="loading ? 'loading-status' : undefined">
                        <span v-if="loading" id="loading-status" class="sr-only">Creating account...</span>
                        <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        {{ loading ? 'Creating account...' : 'Create account' }}
                    </button>
                </div>

                <div class="text-center">
                    <p class="text-sm text-text-secondary">
                        Already have an account?
                        <NuxtLink to="/auth/login"
                            class="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-accent-500 rounded">
                            Sign in here
                        </NuxtLink>
                    </p>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'auth',
    auth: false
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Form data
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const hasAccessibilityNeeds = ref(false)
const acceptTerms = ref(false)

// Form validation
const firstNameError = ref('')
const lastNameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const termsError = ref('')
const error = ref('')
const loading = ref(false)

// Computed properties
const isFormValid = computed(() => {
    return firstName.value && lastName.value && email.value && password.value &&
        confirmPassword.value && acceptTerms.value &&
        !firstNameError.value && !lastNameError.value && !emailError.value &&
        !passwordError.value && !confirmPasswordError.value && !termsError.value
})

// Validation functions
const validateFirstName = () => {
    if (!firstName.value.trim()) {
        firstNameError.value = 'First name is required'
    } else {
        firstNameError.value = ''
    }
}

const validateLastName = () => {
    if (!lastName.value.trim()) {
        lastNameError.value = 'Last name is required'
    } else {
        lastNameError.value = ''
    }
}

const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.value) {
        emailError.value = 'Email is required'
    } else if (!emailRegex.test(email.value)) {
        emailError.value = 'Please enter a valid email address'
    } else {
        emailError.value = ''
    }
}

const validatePassword = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
    if (!password.value) {
        passwordError.value = 'Password is required'
    } else if (!passwordRegex.test(password.value)) {
        passwordError.value = 'Password must be at least 8 characters with uppercase, lowercase, and number'
    } else {
        passwordError.value = ''
    }
}

const validateConfirmPassword = () => {
    if (!confirmPassword.value) {
        confirmPasswordError.value = 'Please confirm your password'
    } else if (password.value !== confirmPassword.value) {
        confirmPasswordError.value = 'Passwords do not match'
    } else {
        confirmPasswordError.value = ''
    }
}

const validateTerms = () => {
    if (!acceptTerms.value) {
        termsError.value = 'You must accept the terms and conditions'
    } else {
        termsError.value = ''
    }
}

// Sign up function
const signUp = async () => {
    // Validate all fields
    validateFirstName()
    validateLastName()
    validateEmail()
    validatePassword()
    validateConfirmPassword()
    validateTerms()

    if (!isFormValid.value) {
        return
    }

    loading.value = true
    error.value = ''

    try {
        const { error: signUpError } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
            options: {
                data: {
                    first_name: firstName.value,
                    last_name: lastName.value,
                    has_accessibility_needs: hasAccessibilityNeeds.value
                }
            }
        })

        if (signUpError) {
            throw signUpError
        }

        // Show success message and redirect
        await navigateTo('/auth/verify-email')
    } catch (err) {
        error.value = err.message || 'An error occurred during registration'
    } finally {
        loading.value = false
    }
}

// Redirect if already logged in
watch(user, (newUser) => {
    if (newUser) {
        navigateTo('/')
    }
}, { immediate: true })

// Set page title for accessibility
useHead({
    title: 'Sign Up - ClearAide',
    meta: [
        { name: 'description', content: 'Create an account to access accessible tax filing and health insurance services' }
    ]
})
</script>

live