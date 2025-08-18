<template>
  <div>
    <!-- Skip link for keyboard navigation -->
    <a href="#main-content" class="skip-link">
      Skip to main content
    </a>

    <!-- Main layout -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Set page meta for accessibility
useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

// Initialize accessibility features on mount
onMounted(() => {
  // Add high contrast mode detection
  if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
    document.documentElement.classList.add('high-contrast')
  }

  // Add reduced motion detection
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reduced-motion')
  }
})
</script>
