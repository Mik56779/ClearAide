<template>
    <div class="min-h-screen">
        <!-- Hero Section -->
        <section class="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20" role="banner">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h1 class="text-4xl md:text-6xl font-bold mb-6">
                        Accessible Tax & Insurance Services
                    </h1>
                    <p class="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
                        File your taxes and apply for health insurance with confidence.
                        Built specifically for people with disabilities, featuring voice controls,
                        screen reader optimization, and step-by-step guidance.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <NuxtLink to="/dashboard/tax-filing"
                            class="btn btn-accent text-lg px-8 py-3 inline-flex items-center justify-center">
                            <svg class="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                    d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                            </svg>
                            Start Tax Filing
                        </NuxtLink>
                        <NuxtLink to="/dashboard/health-insurance"
                            class="btn bg-white text-primary-600 hover:bg-primary-50 text-lg px-8 py-3 inline-flex items-center justify-center">
                            <svg class="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                    d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,6V8H13V6H11M11,10V18H13V10H11Z" />
                            </svg>
                            Health Insurance
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="py-20 bg-white" aria-labelledby="features-heading">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 id="features-heading" class="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                        Built for Accessibility
                    </h2>
                    <p class="text-xl text-text-secondary max-w-2xl mx-auto">
                        Every feature is designed with accessibility in mind, ensuring equal access for all users.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <!-- Voice Controls -->
                    <div class="card text-center">
                        <div class="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="h-8 w-8 text-accent-600" fill="currentColor" viewBox="0 0 24 24"
                                aria-hidden="true">
                                <path
                                    d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-text-primary mb-2">Voice Controls</h3>
                        <p class="text-text-secondary">
                            Use speech-to-text to fill out forms and text-to-speech to hear content read aloud.
                        </p>
                    </div>

                    <!-- Screen Reader Optimized -->
                    <div class="card text-center">
                        <div
                            class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="h-8 w-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24"
                                aria-hidden="true">
                                <path
                                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-text-primary mb-2">Screen Reader Ready</h3>
                        <p class="text-text-secondary">
                            Fully compatible with JAWS, NVDA, and other screen readers with proper ARIA labels.
                        </p>
                    </div>

                    <!-- Keyboard Navigation -->
                    <div class="card text-center">
                        <div
                            class="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="h-8 w-8 text-text-primary" fill="currentColor" viewBox="0 0 24 24"
                                aria-hidden="true">
                                <path
                                    d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-text-primary mb-2">Keyboard Navigation</h3>
                        <p class="text-text-secondary">
                            Complete all tasks using only the keyboard with clear focus indicators and shortcuts.
                        </p>
                    </div>

                    <!-- High Contrast -->
                    <div class="card text-center">
                        <div
                            class="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="h-8 w-8 text-success-600" fill="currentColor" viewBox="0 0 24 24"
                                aria-hidden="true">
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-text-primary mb-2">High Contrast Mode</h3>
                        <p class="text-text-secondary">
                            Toggle high contrast colors for better visibility and reduced eye strain.
                        </p>
                    </div>

                    <!-- Step-by-Step Guidance -->
                    <div class="card text-center">
                        <div
                            class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="h-8 w-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24"
                                aria-hidden="true">
                                <path
                                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-text-primary mb-2">Guided Process</h3>
                        <p class="text-text-secondary">
                            Clear step-by-step instructions with progress indicators and helpful explanations.
                        </p>
                    </div>

                    <!-- Secure & Private -->
                    <div class="card text-center">
                        <div class="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="h-8 w-8 text-accent-600" fill="currentColor" viewBox="0 0 24 24"
                                aria-hidden="true">
                                <path
                                    d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V16H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-text-primary mb-2">Secure & Private</h3>
                        <p class="text-text-secondary">
                            Your personal and financial information is encrypted and protected with bank-level security.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Services Section -->
        <section class="py-20 bg-secondary-50" aria-labelledby="services-heading">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 id="services-heading" class="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                        Our Services
                    </h2>
                    <p class="text-xl text-text-secondary max-w-2xl mx-auto">
                        Comprehensive support for your tax and insurance needs.
                    </p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <!-- Tax Filing -->
                    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div class="p-8">
                            <div class="flex items-center mb-4">
                                <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                                    <svg class="h-6 w-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24"
                                        aria-hidden="true">
                                        <path
                                            d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                                    </svg>
                                </div>
                                <h3 class="text-2xl font-bold text-text-primary">Tax Filing</h3>
                            </div>
                            <p class="text-text-secondary mb-6">
                                File your federal and state taxes with confidence. Our accessible interface guides you
                                through each step,
                                from entering your W-2 information to claiming deductions and credits.
                            </p>
                            <ul class="space-y-2 mb-6">
                                <li class="flex items-center text-text-secondary">
                                    <svg class="h-5 w-5 text-success-500 mr-2" fill="currentColor" viewBox="0 0 20 20"
                                        aria-hidden="true">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    Federal and state tax returns
                                </li>
                                <li class="flex items-center text-text-secondary">
                                    <svg class="h-5 w-5 text-success-500 mr-2" fill="currentColor" viewBox="0 0 20 20"
                                        aria-hidden="true">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    Automatic calculations and error checking
                                </li>
                                <li class="flex items-center text-text-secondary">
                                    <svg class="h-5 w-5 text-success-500 mr-2" fill="currentColor" viewBox="0 0 20 20"
                                        aria-hidden="true">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    Maximum refund guarantee
                                </li>
                                <li class="flex items-center text-text-secondary">
                                    <svg class="h-5 w-5 text-success-500 mr-2" fill="currentColor" viewBox="0 0 20 20"
                                        aria-hidden="true">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    E-file and direct deposit
                                </li>
                            </ul>
                            <NuxtLink to="/dashboard" class="btn btn-primary w-full">
                                Start Tax Filing
                            </NuxtLink>
                        </div>
                    </div>

                    <!-- Health Insurance -->
                    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div class="p-8">
                            <div class="flex items-center mb-4">
                                <div class="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mr-4">
                                    <svg class="h-6 w-6 text-accent-600" fill="currentColor" viewBox="0 0 24 24"
                                        aria-hidden="true">
                                        <path
                                            d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,6V8H13V6H11M11,10V18H13V10H11Z" />
                                    </svg>
                                </div>
                                <h3 class="text-2xl font-bold text-text-primary">Health Insurance</h3>
                            </div>
                            <p class="text-text-secondary mb-6">
                                Find and apply for health insurance coverage that meets your needs and budget.
                                We'll help you understand your options and determine if you qualify for subsidies.
                            </p>
                            <ul class="space-y-2 mb-6">
                                <li class="flex items-center text-text-secondary">
                                    <svg class="h-5 w-5 text-success-500 mr-2" fill="currentColor" viewBox="0 0 20 20"
                                        aria-hidden="true">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    Marketplace and Medicaid applications
                                </li>
                                <li class="flex items-center text-text-secondary">
                                    <svg class="h-5 w-5 text-success-500 mr-2" fill="currentColor" viewBox="0 0 20 20"
                                        aria-hidden="true">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    Subsidy and tax credit calculations
                                </li>
                                <li class="flex items-center text-text-secondary">
                                    <svg class="h-5 w-5 text-success-500 mr-2" fill="currentColor" viewBox="0 0 20 20"
                                        aria-hidden="true">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    Plan comparison and recommendations
                                </li>
                                <li class="flex items-center text-text-secondary">
                                    <svg class="h-5 w-5 text-success-500 mr-2" fill="currentColor" viewBox="0 0 20 20"
                                        aria-hidden="true">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    Special enrollment assistance
                                </li>
                            </ul>
                            <NuxtLink to="/dashboard" class="btn btn-accent w-full">
                                Apply for Insurance
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-20 bg-primary-600 text-white">
            <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">
                    Ready to Get Started?
                </h2>
                <p class="text-xl mb-8 text-primary-100">
                    Join thousands of users who trust AccessTax for their tax and insurance needs.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <NuxtLink v-if="!user" to="/auth/register" class="btn btn-accent text-lg px-8 py-3">
                        Create Free Account
                    </NuxtLink>
                    <NuxtLink v-else to="/dashboard" class="btn btn-accent text-lg px-8 py-3">
                        Go to Dashboard
                    </NuxtLink>
                    <NuxtLink to="/accessibility"
                        class="btn bg-white text-primary-600 hover:bg-primary-50 text-lg px-8 py-3">
                        Learn About Accessibility
                    </NuxtLink>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
const user = useSupabaseUser()

// Set page meta
useHead({
    title: 'AccessTax - Accessible Tax Filing & Health Insurance',
    meta: [
        { name: 'description', content: 'Accessible tax filing and health insurance applications for people with disabilities. Features voice controls, screen reader optimization, and step-by-step guidance.' },
        { name: 'keywords', content: 'accessible tax filing, disability tax help, accessible health insurance, screen reader tax software, voice control tax filing' }
    ]
})

// Announce page load for screen readers
const { announce, ttsEnabled } = useAccessibility()

onMounted(() => {
    if (ttsEnabled.value) {
        announce('Welcome to AccessTax, your accessible tax and insurance solution. Explore our features designed for users with disabilities.', 'polite')
    }
})
</script>