<template>
    <div class="min-h-screen bg-secondary-50">
        <!-- Progress Header -->
        <div class="bg-white shadow-sm border-b border-secondary-200">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div class="flex items-center justify-between mb-4">
                    <h1 class="text-2xl font-bold text-text-primary">
                        {{ taxFiling?.tax_year }} Tax Return
                    </h1>
                    <div class="flex items-center space-x-4">
                        <button @click="saveDraft" :disabled="saving" class="btn btn-secondary text-sm">
                            {{ saving ? 'Saving...' : 'Save Draft' }}
                        </button>
                        <NuxtLink to="/tax-filing" class="btn btn-secondary text-sm">
                            Exit
                        </NuxtLink>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div class="w-full bg-secondary-200 rounded-full h-2 mb-4">
                    <div class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        :style="{ width: `${progressPercentage}%` }" role="progressbar"
                        :aria-valuenow="progressPercentage" aria-valuemin="0" aria-valuemax="100"
                        :aria-label="`Tax filing progress: ${progressPercentage}% complete`"></div>
                </div>

                <!-- Step Navigation -->
                <nav aria-label="Tax filing steps" class="flex flex-wrap gap-2">
                    <button v-for="(step, index) in steps" :key="step.id" @click="goToStep(index)"
                        :disabled="!canAccessStep(index)"
                        class="px-3 py-1 text-sm rounded-md transition-colors duration-200" :class="[
                            currentStepIndex === index
                                ? 'bg-primary-600 text-white'
                                : canAccessStep(index)
                                    ? 'bg-secondary-100 text-text-primary hover:bg-secondary-200'
                                    : 'bg-secondary-50 text-text-muted cursor-not-allowed',
                            { 'ring-2 ring-accent-500': currentStepIndex === index }
                        ]" :aria-current="currentStepIndex === index ? 'step' : undefined">
                        {{ step.title }}
                    </button>
                </nav>
            </div>
        </div>

        <!-- Main Content -->
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div v-if="loading" class="text-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p class="mt-4 text-text-secondary">Loading tax filing...</p>
            </div>

            <div v-else-if="error" class="card text-center py-12">
                <svg class="h-16 w-16 text-error-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24"
                    aria-hidden="true">
                    <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        clip-rule="evenodd" />
                </svg>
                <h2 class="text-xl font-semibold text-text-primary mb-2">Error Loading Tax Filing</h2>
                <p class="text-text-secondary mb-6">{{ error }}</p>
                <NuxtLink to="/tax-filing" class="btn btn-primary">
                    Back to Tax Filing Center
                </NuxtLink>
            </div>

            <!-- Step Content -->
            <div v-else>
                <!-- Personal Information Step -->
                <div v-if="currentStep.id === 'personal'" class="space-y-8">
                    <AccessibleForm title="Personal Information"
                        description="Let's start with your basic information for this tax return." :loading="saving"
                        :is-valid="isPersonalInfoValid" @submit="nextStep" @save="saveDraft" :show-save="true"
                        submit-text="Continue to Filing Status">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AccessibleInput v-model="taxFiling.first_name" label="First Name" type="text" required
                                autocomplete="given-name"
                                help-text="Enter your first name as it appears on your Social Security card" />

                            <AccessibleInput v-model="taxFiling.last_name" label="Last Name" type="text" required
                                autocomplete="family-name"
                                help-text="Enter your last name as it appears on your Social Security card" />

                            <AccessibleInput v-model="taxFiling.ssn" label="Social Security Number" type="text" required
                                placeholder="XXX-XX-XXXX" help-text="Your SSN is encrypted and securely stored"
                                :error-message="ssnError" @blur="validateSSN" />

                            <AccessibleInput v-model="taxFiling.date_of_birth" label="Date of Birth" type="date"
                                required autocomplete="bday" />

                            <AccessibleInput v-model="taxFiling.phone_number" label="Phone Number" type="tel"
                                autocomplete="tel" placeholder="(555) 123-4567"
                                help-text="Optional: For IRS contact if needed" />

                            <AccessibleInput v-model="taxFiling.email" label="Email Address" type="email" required
                                autocomplete="email" help-text="We'll send your tax documents here" />
                        </div>

                        <div class="space-y-6">
                            <h3 class="text-lg font-semibold text-text-primary">Address</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <AccessibleInput v-model="taxFiling.address_line1" label="Street Address" type="text"
                                    required autocomplete="address-line1" class="md:col-span-2" />

                                <AccessibleInput v-model="taxFiling.address_line2" label="Apartment, Suite, etc."
                                    type="text" autocomplete="address-line2" class="md:col-span-2" />

                                <AccessibleInput v-model="taxFiling.city" label="City" type="text" required
                                    autocomplete="address-level2" />

                                <AccessibleInput v-model="taxFiling.state" label="State" type="select" required
                                    autocomplete="address-level1" :options="stateOptions" />

                                <AccessibleInput v-model="taxFiling.zip_code" label="ZIP Code" type="text" required
                                    autocomplete="postal-code" placeholder="12345" />
                            </div>
                        </div>
                    </AccessibleForm>
                </div>

                <!-- Filing Status Step -->
                <div v-if="currentStep.id === 'filing-status'" class="space-y-8">
                    <AccessibleForm title="Filing Status"
                        description="Choose the filing status that best describes your situation on December 31st of the tax year."
                        :loading="saving" :is-valid="isFilingStatusValid" @submit="nextStep" @save="saveDraft"
                        :show-save="true" submit-text="Continue to Income">
                        <div class="space-y-6">
                            <fieldset>
                                <legend class="text-lg font-semibold text-text-primary mb-4">
                                    Select Your Filing Status
                                </legend>
                                <div class="space-y-4">
                                    <div v-for="status in filingStatusOptions" :key="status.value" class="relative">
                                        <label
                                            class="flex items-start p-4 border border-secondary-300 rounded-lg cursor-pointer hover:bg-secondary-50 transition-colors duration-200"
                                            :class="{ 'border-primary-500 bg-primary-50': taxFiling.filing_status === status.value }">
                                            <input v-model="taxFiling.filing_status" type="radio" :value="status.value"
                                                class="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300"
                                                @change="onFilingStatusChange" />
                                            <div class="ml-3">
                                                <div class="text-sm font-medium text-text-primary">
                                                    {{ status.label }}
                                                </div>
                                                <div class="text-sm text-text-secondary">
                                                    {{ status.description }}
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </fieldset>

                            <!-- Spouse Information (if married) -->
                            <div v-if="isMarried" class="space-y-6">
                                <h3 class="text-lg font-semibold text-text-primary">Spouse Information</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <AccessibleInput v-model="taxFiling.spouse_first_name" label="Spouse's First Name"
                                        type="text" required autocomplete="given-name" />

                                    <AccessibleInput v-model="taxFiling.spouse_last_name" label="Spouse's Last Name"
                                        type="text" required autocomplete="family-name" />

                                    <AccessibleInput v-model="taxFiling.spouse_ssn"
                                        label="Spouse's Social Security Number" type="text" required
                                        placeholder="XXX-XX-XXXX"
                                        help-text="Your spouse's SSN is encrypted and securely stored" />
                                </div>
                            </div>
                        </div>
                    </AccessibleForm>
                </div>

                <!-- Income Step -->
                <div v-if="currentStep.id === 'income'" class="space-y-8">
                    <AccessibleForm title="Income Information"
                        description="Enter all sources of income for the tax year. We'll help you calculate your total income."
                        :loading="saving" :is-valid="isIncomeValid" @submit="nextStep" @save="saveDraft"
                        :show-save="true" submit-text="Continue to Deductions">
                        <div class="space-y-8">
                            <!-- W-2 Income -->
                            <div class="space-y-4">
                                <h3 class="text-lg font-semibold text-text-primary">W-2 Wages and Salary</h3>
                                <AccessibleInput v-model.number="taxFiling.w2_income" label="Total W-2 Income"
                                    type="number" step="0.01" min="0"
                                    help-text="Enter the total from all W-2 forms, Box 1"
                                    @input="calculateTotalIncome" />
                            </div>

                            <!-- Self-Employment Income -->
                            <div class="space-y-4">
                                <h3 class="text-lg font-semibold text-text-primary">Self-Employment Income</h3>
                                <AccessibleInput v-model.number="taxFiling.self_employment_income"
                                    label="Self-Employment Income" type="number" step="0.01" min="0"
                                    help-text="Income from freelance work, business, or 1099 forms"
                                    @input="calculateTotalIncome" />
                            </div>

                            <!-- Other Income -->
                            <div class="space-y-4">
                                <h3 class="text-lg font-semibold text-text-primary">Other Income</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <AccessibleInput v-model.number="taxFiling.unemployment_income"
                                        label="Unemployment Compensation" type="number" step="0.01" min="0"
                                        help-text="From Form 1099-G" @input="calculateTotalIncome" />

                                    <AccessibleInput v-model.number="taxFiling.social_security_income"
                                        label="Social Security Benefits" type="number" step="0.01" min="0"
                                        help-text="From Form SSA-1099" @input="calculateTotalIncome" />

                                    <AccessibleInput v-model.number="taxFiling.retirement_income"
                                        label="Retirement Income" type="number" step="0.01" min="0"
                                        help-text="Pensions, IRA distributions, 401(k)" @input="calculateTotalIncome" />

                                    <AccessibleInput v-model.number="taxFiling.other_income" label="Other Income"
                                        type="number" step="0.01" min="0" help-text="Interest, dividends, capital gains"
                                        @input="calculateTotalIncome" />
                                </div>
                            </div>

                            <!-- Total Income Summary -->
                            <div class="bg-primary-50 border border-primary-200 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-primary-800 mb-2">Total Income Summary</h3>
                                <div class="text-2xl font-bold text-primary-900">
                                    ${{ formatCurrency(taxFiling.total_income || 0) }}
                                </div>
                                <p class="text-sm text-primary-700 mt-1">
                                    This is your total income before deductions
                                </p>
                            </div>
                        </div>
                    </AccessibleForm>
                </div>

                <!-- Review Step -->
                <div v-if="currentStep.id === 'review'" class="space-y-8">
                    <AccessibleForm title="Review Your Tax Return"
                        description="Please review all information before submitting your tax return."
                        :loading="submitting" :is-valid="true" @submit="submitTaxReturn" @save="saveDraft"
                        :show-save="true" submit-text="Submit Tax Return" loading-text="Submitting...">
                        <!-- Review sections here -->
                        <div class="space-y-6">
                            <div class="card">
                                <h3 class="text-lg font-semibold text-text-primary mb-4">Personal Information</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span class="text-text-secondary">Name:</span>
                                        <span class="ml-2 text-text-primary">{{ taxFiling.first_name }} {{
                                            taxFiling.last_name }}</span>
                                    </div>
                                    <div>
                                        <span class="text-text-secondary">Filing Status:</span>
                                        <span class="ml-2 text-text-primary">{{
                                            formatFilingStatus(taxFiling.filing_status)
                                        }}</span>
                                    </div>
                                    <div>
                                        <span class="text-text-secondary">SSN:</span>
                                        <span class="ml-2 text-text-primary">{{ taxFiling.ssn }}</span>
                                    </div>
                                    <div>
                                        <span class="text-text-secondary">Date of Birth:</span>
                                        <span class="ml-2 text-text-primary">{{ new
                                            Date(taxFiling.date_of_birth).toLocaleDateString() }}</span>
                                    </div>
                                    <div>
                                        <span class="text-text-secondary">Email:</span>
                                        <span class="ml-2 text-text-primary">{{ taxFiling.email }}</span>
                                    </div>
                                    <div>
                                        <span class="text-text-secondary">Phone:</span>
                                        <span class="ml-2 text-text-primary">{{ taxFiling.phone_number }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="card">
                                <h3 class="text-lg font-semibold text-text-primary mb-4">Address</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span class="text-text-secondary">Street Address:</span>
                                        <span class="ml-2 text-text-primary">{{ taxFiling.address_line1 }}</span>
                                    </div>
                                    <div>
                                        <span class="text-text-secondary">Apartment, Suite, etc.:</span>
                                        <span class="ml-2 text-text-primary">{{ taxFiling.address_line2 }}</span>
                                    </div>
                                    <div>
                                        <span class="text-text-secondary">City:</span>
                                        <span class="ml-2 text-text-primary">{{ taxFiling.city }}</span>
                                    </div>
                                    <div>
                                        <span class="text-text-secondary">State:</span>
                                        <span class="ml-2 text-text-primary">{{ taxFiling.state }}</span>
                                    </div>
                                    <div>
                                        <span class="text-text-secondary">ZIP Code:</span>
                                        <span class="ml-2 text-text-primary">{{ taxFiling.zip_code }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="card" v-if="isMarried">
                                <h3 class="text-lg font-semibold text-text-primary mb-4">Spouse Information</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span class="text-text-secondary">Spouse's Name:</span>
                                        <span class="ml-2 text-text-primary">{{ taxFiling.spouse_first_name }} {{
                                            taxFiling.spouse_last_name }}</span>
                                    </div>
                                    <div>
                                        <span class="text-text-secondary">Spouse's SSN:</span>
                                        <span class="ml-2 text-text-primary">{{ taxFiling.spouse_ssn }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="card">
                                <h3 class="text-lg font-semibold text-text-primary mb-4">Income Summary</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span class="text-text-secondary">Total W-2 Income:</span>
                                        <span class="ml-2 text-text-primary">${{ formatCurrency(taxFiling.w2_income)
                                        }}</span>
                                    </div>
                                    <div>
                                        <span class="text-text-secondary">Self-Employment Income:</span>
                                        <span class="ml-2 text-text-primary">${{
                                            formatCurrency(taxFiling.self_employment_income) }}</span>
                                    </div>
                                    <div>
                                        <span class="text-text-secondary">Unemployment Compensation:</span>
                                        <span class="ml-2 text-text-primary">${{
                                            formatCurrency(taxFiling.unemployment_income) }}</span>
                                    </div>
                                    <div>
                                        <span class="text-text-secondary">Social Security Benefits:</span>
                                        <span class="ml-2 text-text-primary">${{
                                            formatCurrency(taxFiling.social_security_income) }}</span>
                                    </div>
                                    <div>
                                        <span class="text-text-secondary">Retirement Income:</span>
                                        <span class="ml-2 text-text-primary">${{
                                            formatCurrency(taxFiling.retirement_income) }}</span>
                                    </div>
                                    <div>
                                        <span class="text-text-secondary">Other Income:</span>
                                        <span class="ml-2 text-text-primary">${{ formatCurrency(taxFiling.other_income)
                                        }}</span>
                                    </div>
                                    <div class="mt-4">
                                        <span class="text-text-primary font-semibold">Total Income:</span>
                                        <span class="text-2xl text-primary-900 ml-2 font-bold">
                                            ${{ formatCurrency(taxFiling.total_income) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AccessibleForm>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSupabaseUser, useSupabaseClient } from '#imports'
import { useAccessibility } from '~/composables/useAccessibility'

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { announce, ttsEnabled } = useAccessibility()

const taxFiling = ref(null)
const loading = ref(true)
const error = ref('')
const saving = ref(false)
const submitting = ref(false)
const currentStepIndex = ref(0)

const steps = [
    { id: 'personal', title: 'Personal Info' },
    { id: 'filing-status', title: 'Filing Status' },
    { id: 'income', title: 'Income' },
    { id: 'review', title: 'Review & Submit' }
]

const currentStep = computed(() => steps[currentStepIndex.value])
const progressPercentage = computed(() => ((currentStepIndex.value + 1) / steps.length) * 100)

const filingStatusOptions = [
    { value: 'single', label: 'Single', description: 'Unmarried, divorced, or legally separated.' },
    { value: 'married_joint', label: 'Married Filing Jointly', description: 'Married and filing together.' },
    { value: 'married_separate', label: 'Married Filing Separately', description: 'Married but filing separately.' },
    { value: 'head_household', label: 'Head of Household', description: 'Unmarried with dependents.' },
    { value: 'widow', label: 'Qualifying Widow(er)', description: 'Lost spouse in last 2 years with dependents.' }
]

const stateOptions = [
    { value: '', label: 'Select Province' },
    { value: 'LSK', label: 'Lusaka' },
    { value: 'ND', label: 'Ndola' },
    { value: 'CH', label: 'Chilanga' },
    // ... add all states ...
    { value: 'KY', label: 'Kanyama' }
]

// Validation
const isPersonalInfoValid = computed(() => {
    if (!taxFiling.value) return false
    return !!taxFiling.value.first_name && !!taxFiling.value.last_name && !!taxFiling.value.ssn &&
        !!taxFiling.value.date_of_birth && !!taxFiling.value.email && !!taxFiling.value.address_line1 &&
        !!taxFiling.value.city && !!taxFiling.value.state && !!taxFiling.value.zip_code
})
const isFilingStatusValid = computed(() => {
    if (!taxFiling.value) return false
    if (!taxFiling.value.filing_status) return false
    if (isMarried.value) {
        return !!taxFiling.value.spouse_first_name && !!taxFiling.value.spouse_last_name && !!taxFiling.value.spouse_ssn
    }
    return true
})
const isIncomeValid = computed(() => {
    if (!taxFiling.value) return false
    return (
        taxFiling.value.w2_income >= 0 &&
        taxFiling.value.self_employment_income >= 0 &&
        taxFiling.value.unemployment_income >= 0 &&
        taxFiling.value.social_security_income >= 0 &&
        taxFiling.value.retirement_income >= 0 &&
        taxFiling.value.other_income >= 0
    )
})

// Married status
const isMarried = computed(() =>
    taxFiling.value &&
    (taxFiling.value.filing_status === 'married_joint' || taxFiling.value.filing_status === 'married_separate')
)

// Step navigation
function goToStep(index) {
    if (canAccessStep(index)) currentStepIndex.value = index
}
function canAccessStep(index) {
    // Only allow forward navigation if previous steps are valid
    if (index === 0) return true
    if (index === 1) return isPersonalInfoValid.value
    if (index === 2) return isPersonalInfoValid.value && isFilingStatusValid.value
    if (index === 3) return isPersonalInfoValid.value && isFilingStatusValid.value && isIncomeValid.value
    return false
}
function nextStep() {
    if (currentStepIndex.value < steps.length - 1) currentStepIndex.value++
}

// Formatters
function formatFilingStatus(status) {
    const found = filingStatusOptions.find(opt => opt.value === status)
    return found ? found.label : 'Other'
}
function formatCurrency(value) {
    if (typeof value !== 'number') return '0.00'
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// SSN validation
const ssnError = ref('')
function validateSSN() {
    if (!taxFiling.value?.ssn) {
        ssnError.value = 'SSN is required'
        return
    }
    const ssnPattern = /^\d{3}-\d{2}-\d{4}$/
    ssnError.value = ssnPattern.test(taxFiling.value.ssn) ? '' : 'Invalid SSN format'
}

// Income calculation
function calculateTotalIncome() {
    if (!taxFiling.value) return
    const t = taxFiling.value
    t.total_income =
        (Number(t.w2_income) || 0) +
        (Number(t.self_employment_income) || 0) +
        (Number(t.unemployment_income) || 0) +
        (Number(t.social_security_income) || 0) +
        (Number(t.retirement_income) || 0) +
        (Number(t.other_income) || 0)
}

// Filing status change
function onFilingStatusChange() {
    if (!isMarried.value) {
        taxFiling.value.spouse_first_name = ''
        taxFiling.value.spouse_last_name = ''
        taxFiling.value.spouse_ssn = ''
    }
}

// Save draft
async function saveDraft() {
    if (!taxFiling.value) return
    saving.value = true
    try {
        const { error } = await supabase
            .from('tax_filings')
            .update({ ...taxFiling.value })
            .eq('id', taxFiling.value.id)
        if (error) throw error
        if (ttsEnabled.value) announce('Draft saved', 'polite')
    } catch (e) {
        error.value = 'Failed to save draft'
        if (ttsEnabled.value) announce('Failed to save draft', 'assertive')
    } finally {
        saving.value = false
    }
}

// Submit tax return
async function submitTaxReturn() {
    if (!taxFiling.value) return
    submitting.value = true
    try {
        const { error } = await supabase
            .from('tax_filings')
            .update({ ...taxFiling.value, status: 'submitted' })
            .eq('id', taxFiling.value.id)
        if (error) throw error
        if (ttsEnabled.value) announce('Tax return submitted', 'polite')
        await router.push('/tax-filing')
    } catch (e) {
        error.value = 'Failed to submit tax return'
        if (ttsEnabled.value) announce('Failed to submit tax return', 'assertive')
    } finally {
        submitting.value = false
    }
}

// Load filing
onMounted(async () => {
    loading.value = true
    error.value = ''
    const id = route.params.id
    try {
        const { data, error: dbError } = await supabase
            .from('tax_filings')
            .select('*')
            .eq('id', id)
            .single()
        if (dbError) throw dbError
        taxFiling.value = {
            ...{
                first_name: '',
                last_name: '',
                ssn: '',
                date_of_birth: '',
                phone_number: '',
                email: '',
                address_line1: '',
                address_line2: '',
                city: '',
                state: '',
                zip_code: '',
                filing_status: '',
                spouse_first_name: '',
                spouse_last_name: '',
                spouse_ssn: '',
                w2_income: 0,
                self_employment_income: 0,
                unemployment_income: 0,
                social_security_income: 0,
                retirement_income: 0,
                other_income: 0,
                total_income: 0
            },
            ...data
        }
        calculateTotalIncome()
    } catch (e) {
        error.value = 'Could not load tax filing.'
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
