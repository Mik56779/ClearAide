<template>
    <div class="min-h-screen bg-secondary-50">
        <!-- Progress Header -->
        <div class="bg-white shadow-sm border-b border-secondary-200">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div class="flex items-center justify-between mb-4">
                    <h1 class="text-2xl font-bold text-text-primary">
                        {{ application?.application_year }} Health Insurance Application
                    </h1>
                    <div class="flex items-center space-x-4">
                        <button @click="saveDraft" :disabled="saving" class="btn btn-secondary text-sm">
                            {{ saving ? 'Saving...' : 'Save Draft' }}
                        </button>
                        <NuxtLink to="/health-insurance" class="btn btn-secondary text-sm">
                            Exit
                        </NuxtLink>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div class="w-full bg-secondary-200 rounded-full h-2 mb-4">
                    <div class="bg-accent-600 h-2 rounded-full transition-all duration-300"
                        :style="{ width: `${progressPercentage}%` }" role="progressbar"
                        :aria-valuenow="progressPercentage" aria-valuemin="0" aria-valuemax="100"
                        :aria-label="`Application progress: ${progressPercentage}% complete`"></div>
                </div>

                <!-- Step Navigation -->
                <nav aria-label="Application steps" class="flex flex-wrap gap-2">
                    <button v-for="(step, index) in steps" :key="step.id" @click="goToStep(index)"
                        :disabled="!canAccessStep(index)"
                        class="px-3 py-1 text-sm rounded-md transition-colors duration-200" :class="[
                            currentStepIndex === index
                                ? 'bg-accent-600 text-white'
                                : canAccessStep(index)
                                    ? 'bg-secondary-100 text-text-primary hover:bg-secondary-200'
                                    : 'bg-secondary-50 text-text-muted cursor-not-allowed',
                            { 'ring-2 ring-primary-500': currentStepIndex === index }
                        ]" :aria-current="currentStepIndex === index ? 'step' : undefined">
                        {{ step.title }}
                    </button>
                </nav>
            </div>
        </div>

        <!-- Main Content -->
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div v-if="loading" class="text-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto"></div>
                <p class="mt-4 text-text-secondary">Loading application...</p>
            </div>

            <div v-else-if="error" class="card text-center py-12">
                <svg class="h-16 w-16 text-error-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24"
                    aria-hidden="true">
                    <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        clip-rule="evenodd" />
                </svg>
                <h2 class="text-xl font-semibold text-text-primary mb-2">Error Loading Application</h2>
                <p class="text-text-secondary mb-6">{{ error }}</p>
                <NuxtLink to="/health-insurance" class="btn btn-primary">
                    Back to Insurance Center
                </NuxtLink>
            </div>

            <!-- Step Content -->
            <div v-else>
                <!-- Household Information Step -->
                <div v-if="currentStep.id === 'household'" class="space-y-8">
                    <AccessibleForm title="Household Information"
                        description="Tell us about your household size and members who need coverage." :loading="saving"
                        :is-valid="isHouseholdInfoValid" @submit="nextStep" @save="saveDraft" :show-save="true"
                        submit-text="Continue to Income">
                        <div class="space-y-6">
                            <AccessibleInput v-model.number="application.household_size" label="Household Size"
                                type="number" min="1" max="20" required
                                help-text="Include yourself and anyone you claim as a tax dependent"
                                @input="updateHouseholdMembers" />

                            <!-- Household Members -->
                            <div v-if="application.household_size > 0" class="space-y-6">
                                <h3 class="text-lg font-semibold text-text-primary">Household Members</h3>
                                <div v-for="(member, index) in householdMembers" :key="index" class="card">
                                    <h4 class="text-md font-semibold text-text-primary mb-4">
                                        {{ index === 0 ? 'You (Primary Applicant)' : `Household Member ${index + 1}` }}
                                    </h4>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <AccessibleInput v-model="member.first_name" label="First Name" type="text"
                                            required />

                                        <AccessibleInput v-model="member.last_name" label="Last Name" type="text"
                                            required />

                                        <AccessibleInput v-model="member.date_of_birth" label="Date of Birth"
                                            type="date" required />

                                        <AccessibleInput v-model="member.relationship" label="Relationship to You"
                                            type="select" :required="index > 0" :options="relationshipOptions"
                                            :disabled="index === 0" />

                                        <div class="md:col-span-2">
                                            <div class="flex items-center">
                                                <input v-model="member.needs_coverage" type="checkbox"
                                                    :id="`coverage-${index}`"
                                                    class="h-4 w-4 text-accent-600 focus:ring-accent-500 border-secondary-300 rounded" />
                                                <label :for="`coverage-${index}`"
                                                    class="ml-2 text-sm text-text-primary">
                                                    Needs health insurance coverage
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Disability Information -->
                            <div class="space-y-4">
                                <h3 class="text-lg font-semibold text-text-primary">Disability Information</h3>
                                <div class="flex items-start">
                                    <div class="flex items-center h-5">
                                        <input v-model="application.has_disabilities" type="checkbox"
                                            id="has-disabilities"
                                            class="h-4 w-4 text-accent-600 focus:ring-accent-500 border-secondary-300 rounded" />
                                    </div>
                                    <div class="ml-3">
                                        <label for="has-disabilities" class="font-medium text-text-primary">
                                            Someone in the household has a disability
                                        </label>
                                        <p class="text-sm text-text-secondary">
                                            This may affect eligibility for certain programs and accommodations.
                                        </p>
                                    </div>
                                </div>

                                <div v-if="application.has_disabilities" class="space-y-4">
                                    <AccessibleInput v-model="application.disability_details" label="Disability Details"
                                        type="textarea" rows="3"
                                        help-text="Please describe the disabilities and any special accommodations needed" />

                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input v-model="application.needs_special_accommodations" type="checkbox"
                                                id="needs-accommodations"
                                                class="h-4 w-4 text-accent-600 focus:ring-accent-500 border-secondary-300 rounded" />
                                        </div>
                                        <div class="ml-3">
                                            <label for="needs-accommodations" class="font-medium text-text-primary">
                                                Needs special accommodations for insurance enrollment
                                            </label>
                                        </div>
                                    </div>

                                    <div v-if="application.needs_special_accommodations">
                                        <AccessibleInput v-model="application.accommodation_details"
                                            label="Accommodation Details" type="textarea" rows="3"
                                            help-text="Describe the accommodations needed for enrollment or plan management" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AccessibleForm>
                </div>

                <!-- Income Information Step -->
                <div v-if="currentStep.id === 'income'" class="space-y-8">
                    <AccessibleForm title="Income Information"
                        description="Provide your household's expected annual income to determine eligibility for financial assistance."
                        :loading="saving" :is-valid="isIncomeValid" @submit="nextStep" @save="saveDraft"
                        :show-save="true" submit-text="Continue to Current Coverage">
                        <div class="space-y-6">
                            <AccessibleInput v-model.number="application.annual_household_income"
                                label="Expected Annual Household Income" type="number" step="0.01" min="0" required
                                help-text="Include income from all household members for the coverage year"
                                @input="calculateEligibility" />

                            <!-- Income Sources -->
                            <div class="space-y-4">
                                <h3 class="text-lg font-semibold text-text-primary">Income Sources</h3>
                                <p class="text-text-secondary">
                                    Check all that apply to your household's income sources:
                                </p>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div v-for="source in incomeSourceOptions" :key="source.value"
                                        class="flex items-center">
                                        <input v-model="selectedIncomeSources" type="checkbox" :value="source.value"
                                            :id="`income-${source.value}`"
                                            class="h-4 w-4 text-accent-600 focus:ring-accent-500 border-secondary-300 rounded" />
                                        <label :for="`income-${source.value}`" class="ml-2 text-sm text-text-primary">
                                            {{ source.label }}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <!-- Eligibility Estimate -->
                            <div v-if="application.annual_household_income > 0"
                                class="bg-accent-50 border border-accent-200 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-accent-800 mb-4">Eligibility Estimate</h3>
                                <div class="space-y-3">
                                    <div class="flex items-center justify-between">
                                        <span class="text-accent-700">Medicaid Eligible:</span>
                                        <span class="font-medium"
                                            :class="medicaidEligible ? 'text-success-600' : 'text-error-600'">
                                            {{ medicaidEligible ? 'Likely Yes' : 'Likely No' }}
                                        </span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-accent-700">Premium Tax Credits:</span>
                                        <span class="font-medium"
                                            :class="premiumCreditsEligible ? 'text-success-600' : 'text-error-600'">
                                            {{ premiumCreditsEligible ? 'Likely Eligible' : 'Not Eligible' }}
                                        </span>
                                    </div>
                                    <div v-if="estimatedCredit > 0" class="flex items-center justify-between">
                                        <span class="text-accent-700">Estimated Monthly Credit:</span>
                                        <span class="font-medium text-success-600">
                                            ${{ Math.round(estimatedCredit / 12) }}
                                        </span>
                                    </div>
                                </div>
                                <p class="text-xs text-accent-600 mt-4">
                                    This is an estimate. Final eligibility will be determined during the application
                                    review.
                                </p>
                            </div>
                        </div>
                    </AccessibleForm>
                </div>

                <!-- Current Coverage Step -->
                <div v-if="currentStep.id === 'current-coverage'" class="space-y-8">
                    <AccessibleForm title="Current Insurance Coverage"
                        description="Tell us about any current health insurance coverage for your household."
                        :loading="saving" :is-valid="isCoverageValid" @submit="nextStep" @save="saveDraft"
                        :show-save="true" submit-text="Continue to Plan Selection">
                        <div class="space-y-6">
                            <fieldset>
                                <legend class="text-lg font-semibold text-text-primary mb-4">
                                    Current Insurance Status
                                </legend>
                                <div class="space-y-3">
                                    <div v-for="status in insuranceStatusOptions" :key="status.value" class="relative">
                                        <label
                                            class="flex items-start p-4 border border-secondary-300 rounded-lg cursor-pointer hover:bg-secondary-50 transition-colors duration-200"
                                            :class="{ 'border-accent-500 bg-accent-50': application.current_insurance_status === status.value }">
                                            <input v-model="application.current_insurance_status" type="radio"
                                                :value="status.value"
                                                class="mt-1 h-4 w-4 text-accent-600 focus:ring-accent-500 border-secondary-300" />
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

                            <!-- Coverage Preferences -->
                            <div class="space-y-4">
                                <h3 class="text-lg font-semibold text-text-primary">Coverage Preferences</h3>

                                <AccessibleInput v-model="application.preferred_plan_type" label="Preferred Plan Type"
                                    type="select" :options="planTypeOptions"
                                    help-text="Different metal levels offer different cost-sharing arrangements" />

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <AccessibleInput v-model="application.preferred_deductible_range"
                                        label="Preferred Deductible Range" type="text"
                                        help-text="Enter a range (e.g., 500-1000) or select 'No Preference'" />

                                    <AccessibleInput v-model="application.preferred_premium_range"
                                        label="Preferred Monthly Premium Range" type="text"
                                        help-text="Enter a range (e.g., 200-400) or select 'No Preference'" />
                                </div>
                            </div>

                            <!-- Current Coverage Details -->
                            <div v-if="application.current_insurance_status !== 'none'" class="space-y-4">
                                <h3 class="text-lg font-semibold text-text-primary">Current Coverage Details</h3>

                                <AccessibleInput v-model="application.insurance_provider" label="Insurance Provider"
                                    type="text" required />

                                <AccessibleInput v-model="application.policy_number" label="Policy Number" type="text"
                                    required />

                                <AccessibleInput v-model="application.coverage_start_date" label="Coverage Start Date"
                                    type="date" required />

                                <AccessibleInput v-model="application.coverage_end_date" label="Coverage End Date"
                                    type="date" required />

                                <div class="flex items-center">
                                    <input v-model="application.coverage_continues" type="checkbox"
                                        id="coverage-continues"
                                        class="h-4 w-4 text-accent-600 focus:ring-accent-500 border-secondary-300 rounded" />
                                    <label for="coverage-continues" class="ml-2 text-sm text-text-primary">
                                        Coverage will continue after this application
                                    </label>
                                </div>
                            </div>
                        </div>
                    </AccessibleForm>
                </div>

                <!-- Plan Selection Step -->
                <div v-if="currentStep.id === 'plan-selection'" class="space-y-8">
                    <AccessibleForm title="Plan Selection"
                        description="Choose a health insurance plan that best fits your needs." :loading="saving"
                        :is-valid="true" @submit="submitApplication" @save="saveDraft" :show-save="true"
                        submit-text="Submit Application">
                        <div class="space-y-6">
                            <!-- Plan Recommendations -->
                            <div v-if="recommendedPlans.length > 0" class="space-y-4">
                                <h3 class="text-lg font-semibold text-text-primary">Recommended Plans</h3>
                                <div v-for="plan in recommendedPlans" :key="plan.id" class="card p-4">
                                    <div class="flex items-center justify-between mb-2">
                                        <div>
                                            <h4 class="text-md font-semibold text-text-primary">
                                                {{ plan.name }}
                                            </h4>
                                            <p class="text-sm text-text-secondary">
                                                {{ plan.description }}
                                            </p>
                                        </div>
                                        <div class="text-right">
                                            <p class="text-lg font-bold text-text-primary">
                                                ${{ plan.monthly_premium }}<span
                                                    class="text-sm text-text-secondary">/mo</span>
                                            </p>
                                            <p class="text-sm text-text-secondary">
                                                Deductible: ${{ plan.deductible }}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex flex-wrap gap-2">
                                        <button @click="selectPlan(plan)" class="btn btn-primary text-sm">
                                            Select Plan
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Custom Plan Option -->
                            <div class="space-y-4">
                                <h3 class="text-lg font-semibold text-text-primary">Or, Describe Your Ideal Plan</h3>
                                <p class="text-text-secondary">
                                    If you don't see a plan that fits your needs, describe your ideal plan features
                                    below:
                                </p>

                                <AccessibleInput v-model="application.ideal_plan_description"
                                    label="Ideal Plan Description" type="textarea" rows="3"
                                    help-text="e.g., low deductible, specific doctors, coverage for certain medications" />
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

const application = ref(null)
const loading = ref(true)
const error = ref('')
const saving = ref(false)
const currentStepIndex = ref(0)

const steps = [
    { id: 'household', title: 'Household' },
    { id: 'income', title: 'Income' },
    { id: 'current-coverage', title: 'Coverage' }
]
const currentStep = computed(() => steps[currentStepIndex.value])
const progressPercentage = computed(() => ((currentStepIndex.value + 1) / steps.length) * 100)

// Household
const householdMembers = ref([])
const relationshipOptions = [
    { value: 'self', label: 'Self' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'child', label: 'Child' },
    { value: 'parent', label: 'Parent' },
    { value: 'other', label: 'Other' }
]

// Income
const incomeSourceOptions = [
    { value: 'wages', label: 'Wages/Salary' },
    { value: 'self_employment', label: 'Self-Employment' },
    { value: 'unemployment', label: 'Unemployment' },
    { value: 'social_security', label: 'Social Security' },
    { value: 'retirement', label: 'Retirement' },
    { value: 'other', label: 'Other' }
]
const selectedIncomeSources = ref([])

// Coverage
const insuranceStatusOptions = [
    { value: 'none', label: 'No Coverage', description: 'No one in the household is currently insured.' },
    { value: 'employer', label: 'Employer Plan', description: 'Coverage through an employer.' },
    { value: 'medicaid', label: 'Medicaid', description: 'Coverage through Medicaid.' },
    { value: 'marketplace', label: 'Marketplace', description: 'Coverage through the Health Insurance Marketplace.' }
]
const planTypeOptions = [
    { value: '', label: 'No Preference' },
    { value: 'bronze', label: 'Bronze' },
    { value: 'silver', label: 'Silver' },
    { value: 'gold', label: 'Gold' },
    { value: 'platinum', label: 'Platinum' }
]

// Step navigation
function goToStep(index) {
    if (canAccessStep(index)) currentStepIndex.value = index
}
function canAccessStep(index) {
    if (index === 0) return true
    if (index === 1) return isHouseholdInfoValid.value
    if (index === 2) return isHouseholdInfoValid.value && isIncomeValid.value
    return false
}
function nextStep() {
    if (currentStepIndex.value < steps.length - 1) currentStepIndex.value++
}

// Validation
const isHouseholdInfoValid = computed(() => {
    if (!application.value) return false
    if (!application.value.household_size || application.value.household_size < 1) return false
    return householdMembers.value.every(m => m.first_name && m.last_name && m.date_of_birth)
})
const isIncomeValid = computed(() => {
    if (!application.value) return false
    return application.value.annual_household_income >= 0
})
const isCoverageValid = computed(() => {
    if (!application.value) return false
    return !!application.value.current_insurance_status
})

// Update household members
function updateHouseholdMembers() {
    const size = Number(application.value.household_size) || 0
    while (householdMembers.value.length < size) {
        householdMembers.value.push({
            first_name: '',
            last_name: '',
            date_of_birth: '',
            relationship: householdMembers.value.length === 0 ? 'self' : '',
            needs_coverage: true
        })
    }
    while (householdMembers.value.length > size) {
        householdMembers.value.pop()
    }
}

// Eligibility calculations (dummy logic)
const medicaidEligible = computed(() => {
    if (!application.value) return false
    return application.value.annual_household_income < 20000
})
const premiumCreditsEligible = computed(() => {
    if (!application.value) return false
    return application.value.annual_household_income < 60000
})
const estimatedCredit = computed(() => {
    if (!application.value) return 0
    if (!premiumCreditsEligible.value) return 0
    return Math.max(0, 5000 - application.value.annual_household_income * 0.05)
})

// Save draft
async function saveDraft() {
    if (!application.value) return
    saving.value = true
    try {
        const { error } = await supabase
            .from('insurance_applications')
            .update({ ...application.value })
            .eq('id', application.value.id)
        if (error) throw error
        if (ttsEnabled.value) announce('Draft saved', 'polite')
    } catch (e) {
        error.value = 'Failed to save draft'
        if (ttsEnabled.value) announce('Failed to save draft', 'assertive')
    } finally {
        saving.value = false
    }
}

// Load application
onMounted(async () => {
    loading.value = true
    error.value = ''
    const id = route.params.id
    try {
        const { data, error: dbError } = await supabase
            .from('insurance_applications')
            .select('*')
            .eq('id', id)
            .single()
        if (dbError) throw dbError
        application.value = {
            ...{
                household_size: 1,
                annual_household_income: 0,
                has_disabilities: false,
                disability_details: '',
                needs_special_accommodations: false,
                accommodation_details: '',
                current_insurance_status: '',
                preferred_plan_type: '',
                preferred_deductible_range: '',
                preferred_premium_range: ''
            },
            ...data
        }
        updateHouseholdMembers()
    } catch (e) {
        error.value = 'Could not load application.'
    } finally {
        loading.value = false
    }
})

// Recommended plans (dummy data)
const recommendedPlans = ref([
    {
        id: 1,
        name: 'Basic Plan',
        description: 'Low premium plan with high deductible.',
        monthly_premium: 250,
        deductible: 5000
    },
    {
        id: 2,
        name: 'Standard Plan',
        description: 'Moderate premium and deductible.',
        monthly_premium: 350,
        deductible: 2500
    },
    {
        id: 3,
        name: 'Premium Plan',
        description: 'High premium plan with low deductible.',
        monthly_premium: 450,
        deductible: 1000
    }
])

// Select plan
function selectPlan(plan) {
    application.value.preferred_plan_type = plan.name
}

// Submit application
async function submitApplication() {
    // TODO: Implement application submission logic
    console.log('Application submitted:', application.value)
    alert('Application submitted! (Check console for details)')
}
</script>