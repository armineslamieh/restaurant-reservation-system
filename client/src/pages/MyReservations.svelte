<script>
    import { onMount } from 'svelte'
    import { api } from '../lib/api.js'
    import { auth } from '../lib/stores/auth.js'
    import { toast } from '../lib/toasts.js'

    let items = []
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
            const r = await api('/me/reservations', { needsAuth: true })
            items = r.items || []
        } catch (e) {
            error = e.message || 'failed to load'
        }
        loading = false
    }

    function time(t) {
        return new Date(t).toLocaleString()
    }

    function badgeClass(s) {
        if (s === 'active') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
        if (s === 'cancelled') return 'bg-rose-50 text-rose-700 border-rose-200'
        return 'bg-neutral-100 text-neutral-700 border-neutral-200'
    }

    async function cancel(id) {
        try {
            await api(`/reservations/${id}`, { method: 'DELETE', needsAuth: true })
            toast('Reservation cancelled')
            await load()
        } catch (e) {
            toast(e.message || 'failed to cancel')
        }
    }
</script>

<div class="grid gap-6 fade-in">
    <h2 class="text-2xl font-semibold">My Reservations</h2>

    {#if loading}
        <p>Loading…</p>
    {:else if error}
        <p class="text-red-600">{error}</p>
    {:else if !items.length}
        <div class="rounded-2xl border border-neutral-200 p-6">
            <div class="text-neutral-700">No reservations yet.</div>
            <a href="/tables" class="mt-3 inline-block rounded-xl bg-black px-4 py-2 text-white hover:bg-neutral-800">Reserve a table</a>
        </div>
    {:else}
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {#each items as r}
                <div class="overflow-hidden rounded-2xl border border-neutral-200 shadow-sm">
                    <div class="h-36 w-full overflow-hidden">
                        <img
                                src="https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1200&auto=format&fit=crop"
                                alt=""
                                class="h-full w-full object-cover"
                        />
                    </div>
                    <div class="grid gap-2 p-4">
                        <div class="flex items-start justify-between gap-3">
                            <a href={`/reservations/${r.id}`} class="text-lg font-semibold hover:underline">Reservation #{r.id}</a>
                            <span class={`rounded-xl border px-2 py-1 text-xs ${badgeClass(r.status)}`}>{r.status}</span>
                        </div>
                        <div class="text-sm text-neutral-700">{time(r.timeSlot?.start)} – {time(r.timeSlot?.end)}</div>
                        <div class="text-sm text-neutral-700">Party: {r.partySize ?? '—'}</div>
                        <div class="text-sm text-neutral-700">Tables: {r.tables?.map(t => t.name || t.id).join(', ')}</div>
                        <div class="mt-2 flex items-center gap-2">
                            <a href={`/reservations/${r.id}`} class="rounded-xl border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">Open</a>
                            {#if r.status === 'active'}
                                <button on:click={() => cancel(r.id)} class="rounded-xl border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">Cancel</button>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
