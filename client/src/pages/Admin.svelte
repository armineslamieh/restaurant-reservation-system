<script>
    import { onMount } from 'svelte'
    import { api } from '../lib/api.js'
    import { auth } from '../lib/stores/auth.js'

    let loading = true
    let error = ''
    let tables = 0
    let timeslots = 0

    onMount(async () => {
        if (!auth.value) { location.href = '/login'; return }
        await load()
    })

    async function load() {
        loading = true
        error = ''
        try {
            const r1 = await api('/admin/tables', { needsAuth: true })
            const r2 = await api('/admin/timeslots', { needsAuth: true })
            tables = (r1.items || []).length
            timeslots = (r2.items || []).length
        } catch (e) {
            error = e.message || 'failed to load'
        }
        loading = false
    }
</script>

<div class="grid gap-6 fade-in">
    <div class="flex items-end justify-between gap-3">
        <h2 class="text-2xl font-semibold">Admin Dashboard</h2>
        <button on:click={load} class="rounded-xl border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">Reload</button>
    </div>

    {#if error}
        <div class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div>
    {/if}

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-2xl border border-neutral-200 p-4">
            <div class="text-sm text-neutral-600">Tables</div>
            <div class="text-3xl font-semibold">{tables}</div>
            <a href="/admin/tables" class="mt-3 inline-block rounded-xl border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">Manage</a>
        </div>
        <div class="rounded-2xl border border-neutral-200 p-4">
            <div class="text-sm text-neutral-600">Timeslots</div>
            <div class="text-3xl font-semibold">{timeslots}</div>
            <a href="/admin/timeslots" class="mt-3 inline-block rounded-xl border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">Manage</a>
        </div>
        <a href="/admin/users" class="rounded-2xl border border-neutral-200 p-5 transition hover:shadow-md">
            <div class="text-lg font-semibold">Users</div>
            <p class="mt-1 text-sm text-neutral-600">Search and view user accounts.</p>
        </a>
        <a href="/admin/settings" class="rounded-2xl border border-neutral-200 p-5 transition hover:shadow-md">
            <div class="text-lg font-semibold">Settings</div>
            <p class="mt-1 text-sm text-neutral-600">Change limits and configuration.</p>
        </a>
    </div>
    <a href="/admin/reservations" class="rounded-2xl border border-neutral-200 p-5 transition hover:shadow-md">
        <div class="text-lg font-semibold">Reservations</div>
        <p class="mt-1 text-sm text-neutral-600">Search and filter all reservations.</p>
    </a>

</div>
