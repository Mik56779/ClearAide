<template>
    <div class="p-6">
        <header class="mb-6">
            <h1 class="text-3xl font-semibold">Dashboard</h1>
            <p class="text-sm text-text.muted mt-1">Overview of your filings, insurance applications, documents, and
                accessibility settings.</p>
        </header>

        <!-- Live status region for announcements -->
        <div aria-live="polite" class="sr-only" ref="liveRegion">&nbsp;</div>

        <!-- Quick actions -->
        <section aria-labelledby="quick-actions-heading" class="mb-6">
            <h2 id="quick-actions-heading" class="sr-only">Quick actions</h2>
            <div class="flex flex-col md:flex-row gap-3">
                <NuxtLink to="/tax-filling"
                    class="w-full md:w-auto p-3 rounded-lg shadow focus:outline-none focus:ring-4"
                    aria-label="Start a new tax filing">Start New Filing</NuxtLink>
                <NuxtLink to="/health-insurance"
                    class="w-full md:w-auto p-3 rounded-lg shadow focus:outline-none focus:ring-4"
                    aria-label="Start health insurance application">Start Insurance Application</NuxtLink>
                <button @click="triggerUpload"
                    class="w-full md:w-auto p-3 rounded-lg shadow focus:outline-none focus:ring-4"
                    aria-label="Upload a document">Upload Document</button>
                <button @click="exportFilingsCSV"
                    class="w-full md:w-auto p-3 rounded-lg shadow focus:outline-none focus:ring-4"
                    aria-label="Export my filings as CSV">Download Filings (CSV)</button>
            </div>
        </section>

        <!-- Summary cards -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" aria-label="Summary">
            <article tabindex="0" role="region" :aria-labelledby="taxTitleId" class="p-4 rounded-lg border">
                <h3 :id="taxTitleId" class="text-lg font-semibold">Tax Filings</h3>
                <p class="mt-2 text-sm text-text.secondary">You have <strong>{{ counts.tax_filings }}</strong> filings
                    ({{ counts.filings_in_progress }} in progress, {{ counts.filings_submitted }} submitted).</p>
                <div class="mt-3">
                    <NuxtLink to="/tax-filing" class="inline-block p-2 rounded focus:ring-4">Go to Tax Filing</NuxtLink>
                </div>
            </article>

            <article tabindex="0" role="region" :aria-labelledby="insTitleId" class="p-4 rounded-lg border">
                <h3 :id="insTitleId" class="text-lg font-semibold">Health Insurance</h3>
                <p class="mt-2 text-sm text-text.secondary">Applications: <strong>{{ counts.health_applications
                }}</strong>. Eligible for Medicaid: <strong>{{ counts.medicaid_eligible }}</strong></p>
                <div class="mt-3">
                    <NuxtLink to="/health-insurance" class="inline-block p-2 rounded focus:ring-4">Go to Health
                        Insurance</NuxtLink>
                </div>
            </article>

            <article tabindex="0" role="region" :aria-labelledby="docTitleId" class="p-4 rounded-lg border">
                <h3 :id="docTitleId" class="text-lg font-semibold">Documents</h3>
                <p class="mt-2 text-sm text-text.secondary">You have <strong>{{ counts.documents }}</strong> uploaded
                    documents.</p>
                <div class="mt-3">
                    <NuxtLink to="/documents" class="inline-block p-2 rounded focus:ring-4">Manage Documents</NuxtLink>
                </div>
            </article>
        </section>

        <!-- Recent activity list -->
        <section aria-labelledby="recent-heading">
            <h2 id="recent-heading" class="text-xl font-semibold mb-3">Recent Activity</h2>

            <ul class="space-y-3">
                <li v-for="item in recentActivity" :key="item.id"
                    class="p-3 rounded border flex justify-between items-start">
                    <div>
                        <p class="font-medium">{{ item.title }}</p>
                        <p class="text-sm text-text.muted">{{ item.subtitle }}</p>
                    </div>
                    <div class="text-sm text-text.muted">{{ item.time }}</div>
                </li>
                <li v-if="!recentActivity.length" class="p-3 rounded border text-text.muted">No recent activity</li>
            </ul>
        </section>

        <!-- Hidden file input used by upload action -->
        <input ref="fileInput" type="file" class="hidden" @change="handleFile" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

const router = useRouter()
const supabase = useSupabaseClient()

const counts = reactive({
    tax_filings: 0,
    filings_in_progress: 0,
    filings_submitted: 0,
    health_applications: 0,
    medicaid_eligible: 0,
    documents: 0,
})

const recentActivity = ref<Array<{ id: string, title: string, subtitle: string, time: string }>>([])
const liveRegion = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const taxTitleId = 'tax-card-title'
const insTitleId = 'ins-card-title'
const docTitleId = 'doc-card-title'

function announce(message: string) {
    if (!liveRegion.value) return
    liveRegion.value.textContent = ''
    // small timeout to ensure screen readers detect change
    setTimeout(() => { liveRegion.value!.textContent = message }, 50)
}

async function fetchCounts() {
    try {
        // get current user id
        const userRes = await supabase.auth.getUser()
        const userId = userRes.data?.user?.id
        if (!userId) return

        // Tax filings counts
        const { data: allFilings } = await supabase
            .from('tax_filings')
            .select('id,status,updated_at')
            .eq('user_id', userId)

        counts.tax_filings = Array.isArray(allFilings) ? allFilings.length : 0
        counts.filings_in_progress = Array.isArray(allFilings) ? allFilings.filter((f: any) => f.status === 'in_progress' || f.status === 'draft').length : 0
        counts.filings_submitted = Array.isArray(allFilings) ? allFilings.filter((f: any) => f.status === 'submitted').length : 0

        // Health insurance applications
        const { data: apps } = await supabase
            .from('health_insurance_applications')
            .select('id,medicaid_eligible,updated_at')
            .eq('user_id', userId)

        counts.health_applications = Array.isArray(apps) ? apps.length : 0
        counts.medicaid_eligible = Array.isArray(apps) ? apps.filter((a: any) => a.medicaid_eligible).length : 0

        // Documents
        const { data: docs } = await supabase
            .from('user_documents')
            .select('id,file_name,uploaded_at')
            .eq('user_id', userId)

        counts.documents = Array.isArray(docs) ? docs.length : 0

        // Recent activity: combine latest filings, apps, docs
        const recent: Array<any> = []
        if (Array.isArray(allFilings)) {
            allFilings.slice(-5).reverse().forEach((f: any) => recent.push({
                id: `filing-${f.id}`,
                title: `Tax filing (${f.tax_year ?? 'year'}) - ${f.status}`,
                subtitle: `Updated: ${dayjs(f.updated_at).format('MMM D, YYYY')}`,
                time: dayjs(f.updated_at) ?? ''
            }))
        }
        if (Array.isArray(apps)) {
            apps.slice(-5).reverse().forEach((a: any) => recent.push({
                id: `app-${a.id}`,
                title: `Insurance application - ${a.status}`,
                subtitle: `Updated: ${dayjs(a.updated_at).format('MMM D, YYYY')}`,
                time: dayjs(a.updated_at) ?? ''
            }))
        }
        if (Array.isArray(docs)) {
            docs.slice(-5).reverse().forEach((d: any) => recent.push({
                id: `doc-${d.id}`,
                title: `Document uploaded: ${d.file_name}`,
                subtitle: `Uploaded: ${dayjs(d.uploaded_at).format('MMM D, YYYY')}`,
                time: dayjs(d.uploaded_at) ?? ''
            }))
        }

        // sort by uploaded/updated time descending (best-effort)
        recent.sort((a, b) => { return 0 })
        recentActivity.value = recent.slice(0, 6)

        announce('Dashboard updated')
    } catch (e) {
        console.error(e)
        announce('Failed to load dashboard data')
    }
}

function goTo(path: string) { router.push(path) }

function triggerUpload() { if (fileInput.value) fileInput.value.click() }

async function handleFile(e: Event) {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    announce('Uploading document')
    // upload to supabase storage (assumes bucket 'user-documents' exists)
    try {
        const userRes = await supabase.auth.getUser()
        const userId = userRes.data?.user?.id
        if (!userId) throw new Error('Not authenticated')

        const filePath = `${userId}/${Date.now()}-${file.name}`
        const { error: upErr } = await supabase.storage.from('user-documents').upload(filePath, file, { upsert: false })
        if (upErr) throw upErr

        // create reference in user_documents
        const { error: insertErr } = await supabase.from('user_documents').insert([{ user_id: userId, document_type: file.type, file_name: file.name, file_path: filePath, file_size: file.size, mime_type: file.type }])
        if (insertErr) throw insertErr

        announce('Upload complete')
        fetchCounts()
    } catch (err) {
        console.error(err)
        announce('Upload failed')
    } finally {
        // clear value so same file can be uploaded again if needed
        if (fileInput.value) fileInput.value.value = ''
    }
}

function downloadCSV(filename: string, rows: Array<Record<string, any>>) {
    if (!rows.length) return
    const header = Object.keys(rows[0]).join(',')
    const csv = [header, ...rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')]
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    a.remove()
}

async function exportFilingsCSV() {
    announce('Preparing CSV')
    try {
        const userRes = await supabase.auth.getUser()
        const userId = userRes.data?.user?.id
        if (!userId) return announce('Not signed in')

        const { data } = await supabase.from('tax_filings').select('*').eq('user_id', userId)
        if (!Array.isArray(data) || !data.length) return announce('No filings to export')

        // sanitize rows for CSV (pick only a few fields)
        const rows = data.map((r: any) => ({ id: r.id, tax_year: r.tax_year, status: r.status, total_income: r.total_income, tax_owed: r.tax_owed, refund_amount: r.refund_amount, updated_at: r.updated_at }))
        downloadCSV(`tax-filings-${new Date().toISOString()}.csv`, rows)
        announce('CSV ready')
    } catch (e) {
        console.error(e)
        announce('Failed to prepare CSV')
    }
}

onMounted(() => { fetchCounts() })
</script>

<style scoped>
/* Ensure focus ring is visible */
:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.25);
}
</style>
