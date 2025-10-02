<template>
    <div class="min-h-screen bg-secondary-50">
        <!-- Header -->
        <div class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="text-center">
                    <h1 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                        Health Insurance Center
                    </h1>
                    <p class="text-xl text-text-secondary max-w-2xl mx-auto">
                        Apply for affordable health coverage, check eligibility, and manage your insurance applications
                        in one accessible place.
                    </p>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <!-- Current Applications -->
            <section v-if="user" class="mb-12" aria-labelledby="current-applications-heading">
                <h2 id="current-applications-heading" class="text-2xl font-bold text-text-primary mb-6">
                    Your Insurance Applications
                </h2>

                <div v-if="loading" class="text-center py-8">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p class="mt-4 text-text-secondary">Loading your applications...</p>
                </div>

                <div v-else-if="applications.length === 0" class="card text-center py-12">
                    <svg class="h-16 w-16 text-secondary-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24"
                        aria-hidden="true">
                        <path
                            d="M12 4a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 110 12A6 6 0 0112 6zm0 2a4 4 0 100 8 4 4 0 000-8z" />
                    </svg>
                    <h3 class="text-xl font-semibold text-text-primary mb-2">No Applications Yet</h3>
                    <p class="text-text-secondary mb-6">
                        Start your first health insurance application to see your coverage options.
                    </p>
                    <button @click="startNewApplication" class="btn btn-primary">
                        Start New Application
                    </button>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="application in applications" :key="application.id"
                        class="card hover:shadow-lg transition-shadow duration-200">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-text-primary">
                                {{ application.created_at ? formatDate(application.created_at) : 'Application' }}
                            </h3>
                            <span class="px-2 py-1 text-xs font-medium rounded-full"
                                :class="getStatusClass(application.status)">
                                {{ getStatusText(application.status) }}
                            </span>
                        </div>
                        <div class="space-y-2 mb-4">
                            <div class="flex justify-between text-sm">
                                <span class="text-text-secondary">Household Size:</span>
                                <span class="font-medium">{{ application.household_size }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-text-secondary">Annual Income:</span>
                                <span class="font-medium">${{ formatCurrency(application.annual_household_income)
                                    }}</span>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <NuxtLink :to="`/health-insurance/${application.id}`" class="btn btn-primary btn-sm">
                                Continue
                            </NuxtLink>
                            <button v-if="application.status === 'draft'" @click="deleteApplication(application.id)"
                                class="btn btn-error btn-sm">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Getting Started -->
            <section class="mb-12" aria-labelledby="getting-started-heading">
                <h2 id="getting-started-heading" class="text-2xl font-bold text-text-primary mb-6">
                    Getting Started
                </h2>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- New Application -->
                    <div class="card">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mr-4">
                                <svg class="h-6 w-6 text-accent-600" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <h3 class="text-xl font-semibold text-text-primary">Start New Application</h3>
                        </div>
                        <p class="text-text-secondary mb-6">
                            Begin a new health insurance application for {{ currentYear }}.
                        </p>
                        <button @click="startNewApplication" class="btn btn-primary w-full">
                            Start Application
                        </button>
                    </div>

                    <!-- Eligibility Check -->
                    <div class="card">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                                <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M9 17v-2a4 4 0 018 0v2m-4 4a4 4 0 01-4-4H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-2a4 4 0 01-4 4z" />
                                </svg>
                            </div>
                            <h3 class="text-xl font-semibold text-text-primary">Check Eligibility</h3>
                        </div>
                        <p class="text-text-secondary mb-6">
                            Find out if you qualify for Medicaid or premium tax credits.
                        </p>
                        <NuxtLink to="/health-insurance/eligibility" class="btn btn-accent w-full">
                            Check Eligibility
                        </NuxtLink>
                    </div>
                </div>
            </section>

            <!-- Coverage Options -->
            <section class="mb-12" aria-labelledby="coverage-options-heading">
                <h2 id="coverage-options-heading" class="text-2xl font-bold text-text-primary mb-6">
                    Understanding Your Coverage Options
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- Marketplace Plans -->
                    <div class="card text-center">
                        <h3 class="text-lg font-semibold text-text-primary mb-2">Marketplace Plans</h3>
                        <p class="text-text-secondary mb-4">Affordable plans for individuals and families, with possible
                            premium credits.</p>
                        <a href="https://www.healthcare.gov/marketplace" target="_blank"
                            class="btn btn-primary btn-sm">Learn More</a>
                    </div>

                    <!-- Medicaid -->
                    <div class="card text-center">
                        <h3 class="text-lg font-semibold text-text-primary mb-2">Medicaid</h3>
                        <p class="text-text-secondary mb-4">Free or low-cost coverage for those with limited income.</p>
                        <a href="https://www.medicaid.gov/" target="_blank" class="btn btn-primary btn-sm">Learn
                            More</a>
                    </div>

                    <!-- Medicare -->
                    <div class="card text-center">
                        <h3 class="text-lg font-semibold text-text-primary mb-2">Medicare</h3>
                        <p class="text-text-secondary mb-4">Coverage for people 65+ or with certain disabilities.</p>
                        <a href="https://www.medicare.gov/" target="_blank" class="btn btn-primary btn-sm">Learn
                            More</a>
                    </div>

                    <!-- Employer Plans -->
                    <div class="card text-center">
                        <h3 class="text-lg font-semibold text-text-primary mb-2">Employer Plans</h3>
                        <p class="text-text-secondary mb-4">Coverage through your or a family member's employer.</p>
                        <a href="https://www.healthcare.gov/glossary/employer-sponsored-plan/" target="_blank"
                            class="btn btn-primary btn-sm">Learn More</a>
                    </div>
                </div>
            </section>

            <!-- Important Information -->
            <section class="mb-12" aria-labelledby="important-info-heading">
                <h2 id="important-info-heading" class="text-2xl font-bold text-text-primary mb-6">
                    Important Information for {{ currentYear }}
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Open Enrollment -->
                    <div class="card">
                        <h3 class="text-lg font-semibold text-text-primary mb-4">Open Enrollment</h3>
                        <ul class="space-y-2">
                            <li><span class="font-medium">Starts:</span> November 1, {{ currentYear }}</li>
                            <li><span class="font-medium">Ends:</span> January 15, {{ currentYear + 1 }}</li>
                        </ul>
                    </div>

                    <!-- Income Limits -->
                    <div class="card">
                        <h3 class="text-lg font-semibold text-text-primary mb-4">Income Limits</h3>
                        <ul class="space-y-2">
                            <li><span class="font-medium">Medicaid (family of 1):</span> $20,000</li>
                            <li><span class="font-medium">Premium Credits (family of 4):</span> $60,000</li>
                        </ul>
                    </div>

                    <!-- Premium Tax Credits -->
                    <div class="card">
                        <h3 class="text-lg font-semibold text-text-primary mb-4">Premium Tax Credits</h3>
                        <ul class="space-y-2">
                            <li>Available for many Marketplace plans</li>
                            <li>Based on income and household size</li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Help & Resources -->
            <section aria-labelledby="help-resources-heading">
                <h2 id="help-resources-heading" class="text-2xl font-bold text-text-primary mb-6">
                    Help & Resources
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="card">
                        <h3 class="text-lg font-semibold text-text-primary mb-4">Health Insurance Help</h3>
                        <ul class="space-y-3">
                            <li><a href="https://www.healthcare.gov/" target="_blank"
                                    class="text-primary-700 underline">Healthcare.gov</a></li>
                            <li><a href="https://localhelp.healthcare.gov/" target="_blank"
                                    class="text-primary-700 underline">Find Local Assistance</a></li>
                        </ul>
                    </div>

                    <div class="card">
                        <h3 class="text-lg font-semibold text-text-primary mb-4">Accessibility Support</h3>
                        <ul class="space-y-3">
                            <li><a href="/accessibility" class="text-primary-700 underline">Accessibility Features</a>
                            </li>
                            <li><a href="mailto:support@clearaide.org" class="text-primary-700 underline">Contact
                                    Support</a></li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'auth'
})

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const { announce, ttsEnabled } = useAccessibility()

// Reactive data
const loading = ref(true)
const applications = ref([])
const currentYear = new Date().getFullYear()

// Load health insurance applications
const loadApplications = async () => {
    if (!user.value) return

    try {
        loading.value = true
        const { data, error } = await supabase
            .from('insurance_applications')
            .select('*')
            .eq('user_id', user.value.id)
            .order('created_at', { ascending: false })

        if (error) throw error

        applications.value = data || []
    } catch (error) {
        console.error('Error loading applications:', error)
        if (ttsEnabled.value) {
            announce('Error loading applications', 'assertive')
        }
    } finally {
        loading.value = false
    }
}

// Start new application
const startNewApplication = async () => {
    if (!user.value) {
        await navigateTo('/auth/login')
        return
    }

    try {
        const { data, error } = await supabase
            .from('insurance_applications')
            .insert({
                user_id: user.value.id,
                household_size: 1,
                annual_household_income: 0,
                status: 'draft'
            })
            .select()
            .single()

        if (error) throw error

        if (ttsEnabled.value) {
            announce('Starting new application', 'polite')
        }

        await navigateTo(`/health-insurance/${data.id}`)
    } catch (error) {
        console.error('Error creating application:', error)
        if (ttsEnabled.value) {
            announce('Error creating application', 'assertive')
        }
    }
}

// Delete application
const deleteApplication = async (applicationId) => {
    if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
        return
    }

    try {
        const { error } = await supabase
            .from('insurance_applications')
            .delete()
            .eq('id', applicationId)

        if (error) throw error

        applications.value = applications.value.filter(app => app.id !== applicationId)

        if (ttsEnabled.value) {
            announce('Application deleted', 'polite')
        }
    } catch (error) {
        console.error('Error deleting application:', error)
        if (ttsEnabled.value) {
            announce('Error deleting application', 'assertive')
        }
    }
}

// Utility functions
const getStatusClass = (status) => {
    switch (status) {
        case 'draft':
            return 'bg-secondary-100 text-secondary-800'
        case 'submitted':
            return 'bg-accent-100 text-accent-800'
        case 'approved':
            return 'bg-success-100 text-success-800'
        case 'completed':
            return 'bg-success-100 text-success-800'
        default:
            return 'bg-secondary-100 text-secondary-800'
    }
}

const getStatusText = (status) => {
    switch (status) {
        case 'draft':
            return 'Draft'
        case 'submitted':
            return 'Submitted'
        case 'approved':
            return 'Approved'
        case 'completed':
            return 'Completed'
        default:
            return 'Unknown'
    }
}

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatCurrency = (value) => {
    if (typeof value !== 'number') return '0.00'
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

onMounted(() => {
    loadApplications()
})

watch(user, (newUser) => {
    if (newUser) {
        loadApplications()
    }
})
</script>