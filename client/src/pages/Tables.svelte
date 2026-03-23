<script>
    import { onMount } from 'svelte'
    import { api } from '../lib/api.js'
    import { auth } from '../lib/stores/auth.js'
    import { toast } from '../lib/toasts.js'

    let items = []
    let loading = true
    let error = ''
    let selected = []
    let slots = []
    let selectedSlot = ''
    let q = ''
    let minCapacity = ''
    let loc = ''

    onMount(load)

    async function load() {
        loading = true
        error = ''
        try {
            const params = { sort: 'name', order: 'ASC', limit: 100 }
            if (q) params.q = q
            if (minCapacity) params.minCapacity = minCapacity
            if (loc) params.location = loc
            const res = await api('/items', { params })
            items = res.items || []
            if (selected.length) {
                const first = selected[0]
                const a = await api(`/items/${first}/timeslots`)
                slots = a.items || []
            } else {
                slots = []
                selectedSlot = ''
            }
        } catch (e) {
            error = 'Failed to load tables'
        }
        loading = false
    }

    function toggle(id) {
        if (selected.includes(id)) selected = selected.filter(x => x !== id)
        else selected = [...selected, id]
        if (selected.length === 1) fetchSlotsForFirst()
        if (selected.length === 0) { slots = []; selectedSlot = '' }
    }

    async function fetchSlotsForFirst() {
        try {
            const first = selected[0]
            const r = await api(`/items/${first}/timeslots`)
            slots = r.items || []
        } catch (e) {
            slots = []
        }
    }

    async function reserveSelected() {
        if (!auth.value) { location.href = '/login'; return }
        if (!selected.length) return
        if (!selectedSlot) { toast('Choose a time slot'); return }
        try {
            await api('/reservations', {
                method: 'POST',
                needsAuth: true,
                body: {
                    tableIds: selected,
                    timeSlotId: selectedSlot,
                    partySize: 2
                }
            })
            toast('Reservation created!')
            location.href = '/me/reservations'
        } catch (e) {
            toast(e.message || 'Reservation failed')
        }
    }
</script>

<div class="grid gap-6 fade-in">
    <h2 class="text-2xl font-semibold">Available Tables</h2>

    <div class="grid gap-3 rounded-2xl border border-neutral-200 p-4">
        <div class="grid gap-2 sm:grid-cols-3 sm:gap-3">
            <input class="rounded-xl border border-neutral-300 p-2" bind:value={q} placeholder="Search by name" />
            <input class="rounded-xl border border-neutral-300 p-2" bind:value={loc} placeholder="Location" />
            <input class="rounded-xl border border-neutral-300 p-2" bind:value={minCapacity} placeholder="Min capacity" />
        </div>
        <div class="flex gap-3">
            <button on:click={load} class="rounded-xl bg-black px-4 py-2 text-white hover:bg-neutral-800">Search</button>
            <button on:click={() => { q=''; loc=''; minCapacity=''; load() }} class="rounded-xl border border-neutral-300 px-4 py-2 hover:bg-neutral-50">Reset</button>
        </div>
    </div>

    {#if loading}
        <p>Loading…</p>
    {:else if error}
        <p class="text-red-600">{error}</p>
    {:else if !items.length}
        <p>No tables found.</p>
    {:else}
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {#each items as t}
                <div class="group overflow-hidden rounded-2xl border border-neutral-200 shadow-sm transition hover:shadow-md">
                    <img
                            src="https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1200&auto=format&fit=crop"
                            alt="Table"
                            class="h-44 w-full object-cover"
                    />
                    <div class="p-4">
                        <div class="flex items-baseline justify-between">
                            <a href={`/tables/${t.id}`} class="text-lg font-semibold hover:underline">{t.name}</a>
                            <div class="text-sm text-neutral-600">Seats {t.capacity}</div>
                        </div>
                        <div class="mt-1 text-sm text-neutral-600">{t.location}</div>
                        <div class="mt-3 flex items-center justify-between">
                            <button on:click={() => toggle(t.id)} class="rounded-xl border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">
                                {selected.includes(t.id) ? 'Selected' : 'Select'}
                            </button>
                            <a href={`/admin/reservations?itemId=${t.id}`} class="rounded-xl border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">Reservations</a>
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <div class="mt-6 grid gap-3 rounded-2xl border border-neutral-200 p-4">
            <div class="text-sm text-neutral-700">Selected: {selected.join(', ') || 'none'}</div>
            <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                    <select bind:value={selectedSlot} class="w-full rounded-xl border border-neutral-300 p-2">
                        <option value="">Choose time</option>
                        {#each slots as s}
                            <option value={s.id} disabled={!s.available}>
                                {new Date(s.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                {s.available ? '' : ' (taken)'}
                            </option>
                        {/each}
                    </select>
                </div>
                <div class="flex items-center gap-3">
                    <button
                            on:click={reserveSelected}
                            class="rounded-xl bg-black px-5 py-2.5 text-white hover:bg-neutral-800 disabled:opacity-50"
                            disabled={!selected.length || !selectedSlot}
                    >
                        Reserve selected
                    </button>
                    <button
                            on:click={() => { selected = []; selectedSlot = ''; slots = [] }}
                            class="rounded-xl border border-neutral-300 px-5 py-2.5 hover:bg-neutral-50 disabled:opacity-50"
                            disabled={!selected.length}
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>
