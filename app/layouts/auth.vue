<template>
    <div class="min-h-screen bg-secondary-50">
        <!-- Skip link for keyboard navigation -->
        <a href="#main-content" class="skip-link">
            Skip to main content
        </a>

        <!-- Simple header for auth pages -->
        <header class="bg-white shadow-sm" role="banner">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <NuxtLink to="/"
                        class="flex items-center space-x-2 text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-accent-500 rounded-md p-2"
                        aria-label="Go to homepage">
                        <svg class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                        <span class="text-xl font-bold">AccessTax</span>
                    </NuxtLink>

                    <!-- Accessibility controls -->
                    <AccessibilityControls />
                </div>
            </div>
        </header>

        <!-- Main content -->
        <main id="main-content" role="main">
            <slot />
        </main>

        <!-- Simple footer for auth pages -->
        <footer class="bg-white border-t border-secondary-200" role="contentinfo">
            <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <p class="text-center text-sm text-text-secondary">
                    &copy; 2025 AccessTax. Accessible tax and insurance services for everyone.
                </p>
            </div>
        </footer>
    </div>
</template>

<script setup>
// Set page meta for accessibility
useHead({
    htmlAttrs: {
        lang: 'en'
    }
})
</script>