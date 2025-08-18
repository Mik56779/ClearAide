<template>
    <div class="min-h-screen bg-secondary-50">
        <!-- Header -->
        <div class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="text-center">
                    <h1 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                        Tax Filing Center
                    </h1>
                    <p class="text-xl text-text-secondary max-w-2xl mx-auto">
                        File your federal and state taxes with our accessible, step-by-step process.
                        We'll guide you through every form and calculation.
                    </p>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <!-- Current Tax Filings -->
            <section v-if="user" class="mb-12" aria-labelledby="current-filings-heading">
                <h2 id="current-filings-heading" class="text-2xl font-bold text-text-primary mb-6">
                    Your Tax Filings
                </h2>

                <div v-if="loading" class="text-center py-8">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p class="mt-4 text-text-secondary">Loading your tax filings...</p>
                </div>

                <div v-else-if="taxFilings.length === 0" class="card text-center py-12">
                    <svg class="h-16 w-16 text-secondary-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24"
                        aria-hidden="true">
                        <path
                            d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                    <h3 class="text-xl font-semibold text-text-primary mb-2">No Tax Filings Yet</h3>
                    <p class="text-text-secondary mb-6">
                        Start your first tax return to get organized and maximize your refund.
                    </p>
                    <button @click="startNewFiling" class="btn btn-primary">
                        Start New Tax Return
                    </button>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="filing in taxFilings" :key="filing.id"
                        class="card hover:shadow-lg transition-shadow duration-200">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-text-primary">
                                {{ filing.tax_year }} Tax Return
                            </h3>
                            <span class="px-2 py-1 text-xs font-medium rounded-full"
                                :class="getStatusClass(filing.status)">
                                {{ getStatusText(filing.status) }}
                            </span>
                        </div>

                        <div class="space-y-2 mb-4">
                            <div class="flex justify-between text-sm">
                                <span class="text-text-secondary">Filing Status:</span>
                                <span class="text-text-primary">{{ formatFilingStatus(filing.filing_status) }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-text-secondary">Last Updated:</span>
                                <span class="text-text-primary">{{ formatDate(filing.updated_at) }}</span>
                            </div>
                            <div v-if="filing.total_income" class="flex justify-between text-sm">
                                <span class="text-text-secondary">Total Income:</span>
                                <span class="text-text-primary">${{ formatCurrency(filing.total_income) }}</span>
                            </div>
                        </div>

                        <div class="flex gap-2">
                            <NuxtLink :to="`/tax-filing/${filing.id}`" class="btn btn-primary flex-1 text-sm">
                                {{ filing.status === 'draft' ? 'Continue' : 'View' }}
                            </NuxtLink>
                            <button v-if="filing.status === 'draft'" @click="deleteFiling(filing.id)"
                                class="btn btn-secondary text-sm" :aria-label="`Delete ${filing.tax_year} tax return`">
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
                    <!-- New Tax Return -->
                    <div class="card">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                                <svg class="h-6 w-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24"
                                    aria-hidden="true">
                                    <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                                </svg>
                            </div>
                            <h3 class="text-xl font-semibold text-text-primary">Start New Tax Return</h3>
                        </div>
                        <p class="text-text-secondary mb-6">
                            Begin filing your {{ currentTaxYear }} tax return. We'll guide you through each step
                            and help you claim all eligible deductions and credits.
                        </p>
                        <button @click="startNewFiling" class="btn btn-primary w-full">
                            Start {{ currentTaxYear }} Tax Return
                        </button>
                    </div>

                    <!-- Import Previous Year -->
                    <div class="card">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mr-4">
                                <svg class="h-6 w-6 text-accent-600" fill="currentColor" viewBox="0 0 24 24"
                                    aria-hidden="true">
                                    <path
                                        d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                                </svg>
                            </div>
                            <h3 class="text-xl font-semibold text-text-primary">Import Previous Year</h3>
                        </div>
                        <p class="text-text-secondary mb-6">
                            Save time by importing information from your previous tax return.
                            We'll pre-fill common information like your personal details and carry-forward items.
                        </p>
                        <button @click="importPreviousYear" class="btn btn-accent w-full" :disabled="!hasPreviousYear">
                            Import from {{ currentTaxYear - 1 }}
                        </button>
                    </div>
                </div>
            </section>

            <!-- Tax Year Information -->
            <section class="mb-12" aria-labelledby="tax-year-info-heading">
                <h2 id="tax-year-info-heading" class="text-2xl font-bold text-text-primary mb-6">
                    {{ currentTaxYear }} Tax Year Information
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Important Dates -->
                    <div class="card">
                        <h3 class="text-lg font-semibold text-text-primary mb-4">Important Dates</h3>
                        <ul class="space-y-2">
                            <li class="flex justify-between text-sm">
                                <span class="text-text-secondary">Filing Deadline:</span>
                                <span class="text-text-primary font-medium">April 15, {{ currentTaxYear + 1 }}</span>
                            </li>
                            <li class="flex justify-between text-sm">
                                <span class="text-text-secondary">Extension Deadline:</span>
                                <span class="text-text-primary font-medium">October 15, {{ currentTaxYear + 1 }}</span>
                            </li>
                            <li class="flex justify-between text-sm">
                                <span class="text-text-secondary">IRA Contribution:</span>
                                <span class="text-text-primary font-medium">April 15, {{ currentTaxYear + 1 }}</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Standard Deductions -->
                    <div class="card">
                        <h3 class="text-lg font-semibold text-text-primary mb-4">Standard Deductions</h3>
                        <ul class="space-y-2">
                            <li class="flex justify-between text-sm">
                                <span class="text-text-secondary">Single:</span>
                                <span class="text-text-primary font-medium">$13,850</span>
                            </li>
                            <li class="flex justify-between text-sm">
                                <span class="text-text-secondary">Married Filing Jointly:</span>
                                <span class="text-text-primary font-medium">$27,700</span>
                            </li>
                            <li class="flex justify-between text-sm">
                                <span class="text-text-secondary">Head of Household:</span>
                                <span class="text-text-primary font-medium">$20,800</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Tax Brackets -->
                    <div class="card">
                        <h3 class="text-lg font-semibold text-text-primary mb-4">Tax Brackets (Single)</h3>
                        <ul class="space-y-2">
                            <li class="flex justify-between text-sm">
                                <span class="text-text-secondary">10%:</span>
                                <span class="text-text-primary font-medium">$0 - $11,000</span>
                            </li>
                            <li class="flex justify-between text-sm">
                                <span class="text-text-secondary">12%:</span>
                                <span class="text-text-primary font-medium">$11,001 - $44,725</span>
                            </li>
                            <li class="flex justify-between text-sm">
                                <span class="text-text-secondary">22%:</span>
                                <span class="text-text-primary font-medium">$44,726 - $95,375</span>
                            </li>
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
                        <h3 class="text-lg font-semibold text-text-primary mb-4">Tax Help</h3>
                        <ul class="space-y-3">
                            <li>
                                <a href="#" class="text-primary-600 hover:text-primary-700 underline">
                                    Tax Deduction Checklist
                                </a>
                            </li>
                            <li>
                                <a href="#" class="text-primary-600 hover:text-primary-700 underline">
                                    Understanding Tax Credits
                                </a>
                            </li>
                            <li>
                                <a href="#" class="text-primary-600 hover:text-primary-700 underline">
                                    Common Tax Mistakes to Avoid
                                </a>
                            </li>
                            <li>
                                <a href="#" class="text-primary-600 hover:text-primary-700 underline">
                                    Tax Forms and Schedules Guide
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="card">
                        <h3 class="text-lg font-semibold text-text-primary mb-4">Accessibility Support</h3>
                        <ul class="space-y-3">
                            <li>
                                <NuxtLink to="/accessibility" class="text-primary-600 hover:text-primary-700 underline">
                                    Accessibility Features Guide
                                </NuxtLink>
                            </li>
                            <li>
                                <a href="#" class="text-primary-600 hover:text-primary-700 underline">
                                    Screen Reader Instructions
                                </a>
                            </li>
                            <li>
                                <a href="#" class="text-primary-600 hover:text-primary-700 underline">
                                    Keyboard Navigation Help
                                </a>
                            </li>
                            <li>
                                <a href="#" class="text-primary-600 hover:text-primary-700 underline">
                                    Voice Control Tutorial
                                </a>
                            </li>
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
const taxFilings = ref([])
const currentTaxYear = new Date().getFullYear() - 1 // Previous year for tax filing

// Computed properties
const hasPreviousYear = computed(() => {
    return taxFilings.value.some(filing => filing.tax_year === currentTaxYear - 1)
})

// Load tax filings
const loadTaxFilings = async () => {
    if (!user.value) return

    try {
        loading.value = true
        const { data, error } = await supabase
            .from('tax_filings')
            .select('*')
            .eq('user_id', user.value.id)
            .order('tax_year', { ascending: false })

        if (error) throw error

        taxFilings.value = data || []
    } catch (error) {
        console.error('Error loading tax filings:', error)
        if (ttsEnabled.value) {
            announce('Error loading tax filings', 'assertive')
        }
    } finally {
        loading.value = false
    }
}

// Start new tax filing
const startNewFiling = async () => {
    if (!user.value) {
        await navigateTo('/auth/login')
        return
    }

    try {
        const { data, error } = await supabase
            .from('tax_filings')
            .insert({
                user_id: user.value.id,
                tax_year: currentTaxYear,
                filing_status: 'single',
                status: 'draft'
            })
            .select()
            .single()

        if (error) throw error

        if (ttsEnabled.value) {
            announce('Starting new tax return', 'polite')
        }

        await navigateTo(`/tax-filing/${data.id}`)
    } catch (error) {
        console.error('Error creating tax filing:', error)
        if (ttsEnabled.value) {
            announce('Error creating tax return', 'assertive')
        }
    }
}

// Import from previous year
const importPreviousYear = async () => {
    if (!hasPreviousYear.value) return

    try {
        const previousFiling = taxFilings.value.find(filing => filing.tax_year === currentTaxYear - 1)
        if (!previousFiling) return

        const { data, error } = await supabase
            .from('tax_filings')
            .insert({
                user_id: user.value.id,
                tax_year: currentTaxYear,
                filing_status: previousFiling.filing_status,
                status: 'draft',
                spouse_first_name: previousFiling.spouse_first_name,
                spouse_last_name: previousFiling.spouse_last_name
            })
            .select()
            .single()

        if (error) throw error

        if (ttsEnabled.value) {
            announce('Imported information from previous year', 'polite')
        }

        await navigateTo(`/tax-filing/${data.id}`)
    } catch (error) {
        console.error('Error importing previous year:', error)
        if (ttsEnabled.value) {
            announce('Error importing previous year data', 'assertive')
        }
    }
}

// Delete tax filing
const deleteFiling = async (filingId) => {
    if (!confirm('Are you sure you want to delete this tax filing? This action cannot be undone.')) {
        return
    }

    try {
        const { error } = await supabase
            .from('tax_filings')
            .delete()
            .eq('id', filingId)

        if (error) throw error

        taxFilings.value = taxFilings.value.filter(filing => filing.id !== filingId)

        if (ttsEnabled.value) {
            announce('Tax filing deleted', 'polite')
        }
    } catch (error) {
        console.error('Error deleting tax filing:', error)
        if (ttsEnabled.value) {
            announce('Error deleting tax filing', 'assertive')
        }
    }
}

// Utility functions
const getStatusClass = (status) => {
    switch (status) {
        case 'draft':
            return 'bg-secondary-100 text-secondary-800'
        case 'in_progress':
            return 'bg-primary-100 text-primary-800'
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
        case 'in_progress':
            return 'In Progress'
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

const formatFilingStatus = (status) => {
    switch (status) {
        case 'single':
            return 'Single'
        case 'married_joint':
            return 'Married Filing Jointly'
        case 'married_separate':
            return 'Married Filing Separately'
        case 'head_household':
            return 'Head of Household'
        case 'widow':
            return 'Qualifying Widow(er)'
        default:
            return 'Other'
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
    loadTaxFilings()
})

watch(user, (newUser) => {
    if (newUser) {
        loadTaxFilings()
    }
})
</script>