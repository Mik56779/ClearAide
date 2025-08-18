<template>
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h1 class="mt-6 text-center text-3xl font-extrabold text-text-primary">
                    Sign in to your account
                </h1>
                <p class="mt-2 text-center text-sm text-text-secondary">
                    Access your tax filing and health insurance applications
                </p>
            </div>

            <form @submit.prevent="signIn" class="mt-8 space-y-6" novalidate>
                <div class="space-y-4">
                    <div>
                        <label for="email" class="form-label">
                            Email address
                        </label>
                        <input id="email" v-model="email" type="email" autocomplete="email" required class="form-input"
                            :class="{ 'border-error-500 focus:border-error-500 focus:ring-error-500': emailError }"
                            aria-describedby="email-error" @blur="validateEmail" />
                        <div v-if="emailError" id="email-error" class="form-error" role="alert">
                            {{ emailError }}
                        </div>
                    </div>

                    <div>
                        <label for="password" class="form-label">
                            Password
                        </label>
                        <input id="password" v-model="password" type="password" autocomplete="current-password" required
                            class="form-input"
                            :class="{ 'border-error-500 focus:border-error-500 focus:ring-error-500': passwordError }"
                            aria-describedby="password-error" @blur="validatePassword" />
                        <div v-if="passwordError" id="password-error" class="form-error" role="alert">
                            {{ passwordError }}
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input id="remember-me" v-model="rememberMe" type="checkbox"
                            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded" />
                        <label for="remember-me" class="ml-2 block text-sm text-text-primary">
                            Remember me
                        </label>
                    </div>

                    <div class="text-sm">
                        <NuxtLink to="/auth/forgot-password"
                            class="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-accent-500 rounded">
                            Forgot your password?
                        </NuxtLink>
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
                                Sign in failed
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
                        <span v-if="loading" id="loading-status" class="sr-only">Signing in...</span>
                        <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        {{ loading ? 'Signing in...' : 'Sign in' }}
                    </button>
                </div>

                <div class="text-center">
                    <p class="text-sm text-text-secondary">
                        Don't have an account?
                        <NuxtLink to="/auth/register"
                            class="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-accent-500 rounded">
                            Sign up here
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
const email = ref('')
const password = ref('')
const rememberMe = ref(false)

// Form validation
const emailError = ref('')
const passwordError = ref('')
const error = ref('')
const loading = ref(false)

// Computed properties
const isFormValid = computed(() => {
    return email.value && password.value && !emailError.value && !passwordError.value
})

// Validation functions
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
    if (!password.value) {
        passwordError.value = 'Password is required'
    } else if (password.value.length < 6) {
        passwordError.value = 'Password must be at least 6 characters'
    } else {
        passwordError.value = ''
    }
}

// Sign in function
const signIn = async () => {
    // Validate form
    validateEmail()
    validatePassword()

    if (!isFormValid.value) {
        return
    }

    loading.value = true
    error.value = ''

    try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        })

        if (signInError) {
            throw signInError
        }

        // Redirect to dashboard or intended page
        await navigateTo('/')
    } catch (err) {
        error.value = err.message || 'An error occurred during sign in'
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
    title: 'Sign In - ClearAide',
    meta: [
        { name: 'description', content: 'Sign in to access your tax filing and health insurance applications' }
    ]
})
</script>
