<template>
    <div class="min-h-screen bg-secondary-50">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b border-secondary-200" role="banner">
            <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Main navigation">
                <div class="flex justify-between items-center h-16">
                    <!-- Logo and title -->
                    <div class="flex items-center">
                        <NuxtLink to="/"
                            class="flex items-center space-x-2 text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-accent-500 rounded-md p-2"
                            aria-label="Go to homepage">
                            <svg class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                            <span class="text-xl font-bold">AccessTax</span>
                        </NuxtLink>
                    </div>

                    <!-- Navigation menu -->
                    <div class="hidden md:block">
                        <div class="ml-10 flex items-baseline space-x-4">
                            <NuxtLink to="/"
                                class="px-3 py-2 rounded-md text-sm font-medium text-text-primary hover:text-primary-600 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
                                aria-current="page">
                                Home
                            </NuxtLink>
                            <NuxtLink to="/tax-filing"
                                class="px-3 py-2 rounded-md text-sm font-medium text-text-primary hover:text-primary-600 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-accent-500">
                                Tax Filing
                            </NuxtLink>
                            <NuxtLink to="/health-insurance"
                                class="px-3 py-2 rounded-md text-sm font-medium text-text-primary hover:text-primary-600 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-accent-500">
                                Health Insurance
                            </NuxtLink>
                            <NuxtLink to="/accessibility"
                                class="px-3 py-2 rounded-md text-sm font-medium text-text-primary hover:text-primary-600 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-accent-500">
                                Accessibility
                            </NuxtLink>
                        </div>
                    </div>

                    <!-- User menu -->
                    <div class="flex items-center space-x-4">
                        <!-- TTS/STT Controls -->
                        <AccessibilityControls />

                        <!-- Auth buttons -->
                        <div v-if="!user" class="flex items-center space-x-2">
                            <NuxtLink to="/auth/login" class="btn btn-secondary text-sm">
                                Sign In
                            </NuxtLink>
                            <NuxtLink to="/auth/register" class="btn btn-primary text-sm">
                                Sign Up
                            </NuxtLink>
                        </div>
                        <div v-else class="flex items-center space-x-2">
                            <span class="text-sm text-text-secondary">Welcome, {{ user.email }}</span>
                            <button @click="signOut" class="btn btn-secondary text-sm">
                                Sign Out
                            </button>
                        </div>
                    </div>

                    <!-- Mobile menu button -->
                    <div class="md:hidden">
                        <button @click="mobileMenuOpen = !mobileMenuOpen"
                            class="p-2 rounded-md text-text-primary hover:text-primary-600 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
                            :aria-expanded="mobileMenuOpen" aria-controls="mobile-menu"
                            aria-label="Toggle navigation menu">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                aria-hidden="true">
                                <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Mobile menu -->
                <div v-show="mobileMenuOpen" class="md:hidden" id="mobile-menu">
                    <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-secondary-200 mt-4">
                        <NuxtLink to="/"
                            class="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:text-primary-600 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
                            @click="mobileMenuOpen = false">
                            Home
                        </NuxtLink>
                        <NuxtLink to="/tax-filing"
                            class="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:text-primary-600 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
                            @click="mobileMenuOpen = false">
                            Tax Filing
                        </NuxtLink>
                        <NuxtLink to="/health-insurance"
                            class="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:text-primary-600 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
                            @click="mobileMenuOpen = false">
                            Health Insurance
                        </NuxtLink>
                        <NuxtLink to="/accessibility"
                            class="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:text-primary-600 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
                            @click="mobileMenuOpen = false">
                            Accessibility
                        </NuxtLink>
                    </div>
                </div>
            </nav>
        </header>

        <!-- Main content -->
        <main id="main-content" class="flex-1" role="main">
            <slot />
        </main>

        <!-- Footer -->
        <footer class="bg-white border-t border-secondary-200 mt-auto" role="contentinfo">
            <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 class="text-sm font-semibold text-text-primary uppercase tracking-wider">Services</h3>
                        <ul class="mt-4 space-y-2">
                            <li>
                                <NuxtLink to="/tax-filing" class="text-text-secondary hover:text-primary-600">Tax Filing
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/health-insurance" class="text-text-secondary hover:text-primary-600">
                                    Health Insurance</NuxtLink>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-sm font-semibold text-text-primary uppercase tracking-wider">Accessibility</h3>
                        <ul class="mt-4 space-y-2">
                            <li>
                                <NuxtLink to="/accessibility" class="text-text-secondary hover:text-primary-600">
                                    Accessibility Features</NuxtLink>
                            </li>
                            <li><a href="#" class="text-text-secondary hover:text-primary-600">Screen Reader Guide</a>
                            </li>
                            <li><a href="#" class="text-text-secondary hover:text-primary-600">Keyboard Navigation</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-sm font-semibold text-text-primary uppercase tracking-wider">Support</h3>
                        <ul class="mt-4 space-y-2">
                            <li><a href="#" class="text-text-secondary hover:text-primary-600">Help Center</a></li>
                            <li><a href="#" class="text-text-secondary hover:text-primary-600">Contact Us</a></li>
                            <li><a href="#" class="text-text-secondary hover:text-primary-600">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div class="mt-8 border-t border-secondary-200 pt-8">
                    <p class="text-center text-text-secondary">
                        &copy; 2025 AccessTax. Built with accessibility in mind for everyone.
                    </p>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const mobileMenuOpen = ref(false)

const signOut = async () => {
    await supabase.auth.signOut()
    await navigateTo('/')
}

// Close mobile menu when route changes
watch(() => useRoute().path, () => {
    mobileMenuOpen.value = false
})
</script>
