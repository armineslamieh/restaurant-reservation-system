<script>
    import { onMount } from 'svelte'
    import { api } from '../lib/api.js'
    import { auth } from '../lib/stores/auth.js'
    import { toast } from '../lib/toasts.js'

    export let context = { params: {} }
    const id = context?.params?.id

    let item = null
    let loading = true
    let error = ''

    onMount(async () => {
        if (!auth.value) { location.href = '/login'; return }
        await load()
    })

    async function load() {
        loading = true
        error = ''
        try {
            const r = await api(`/reservations/${id}`, { needsAuth: true })
            item = r.item
        } catch (e) {
            error = e.message || 'failed to load'
        }
        loading = false
    }

    function time(t) {
        return new Date(t).toLocaleString()
    }

    async function cancel() {
        try {
            await api(`/reservations/${id}`, { method: 'DELETE', needsAuth: true })
            toast('Reservation cancelled')
            location.href = '/me/reservations'
        } catch (e) {
            toast(e.message || 'failed to cancel')
        }
    }
</script>

<div class="grid gap-6 fade-in">
    {#if loading}
        <p>Loading…</p>
    {:else if error}
        <p class="text-red-600">{error}</p>
    {:else if !item}
        <p>Not found.</p>
    {:else}
        <div class="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <h2 class="text-2xl font-semibold">Reservation #{item.id}</h2>
                    <div class="mt-1 text-sm text-neutral-700">Status: {item.status}</div>
                </div>
                <a href="/me/reservations" class="rounded-xl border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">Back</a>
            </div>

            <div class="mt-4 grid gap-2 text-sm text-neutral-700">
                <div>Time: {time(item.timeSlot?.start)} – {time(item.timeSlot?.end)}</div>
                <div>Party: {item.partySize ?? '—'}</div>
                <div>Tables: {item.tables?.map(t => t.name || t.id).join(', ')}</div>
            </div>

            {#if item.status === 'active'}
                <button on:click={cancel} class="mt-5 rounded-xl border border-neutral-300 px-4 py-2 hover:bg-neutral-50">
                    Cancel reservation
                </button>
            {/if}
        </div>
    {/if}
</div>
