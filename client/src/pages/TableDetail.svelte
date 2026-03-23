<script>
    import { onMount } from 'svelte'
    import { api } from '../lib/api.js'
    import { auth } from '../lib/stores/auth.js'
    import { toast } from '../lib/toasts.js'

    export let context = { params: {} }
    const id = context?.params?.id

    let item = null
    let slots = []
    let selectedSlot = ''
    let loading = true
    let error = ''

    onMount(load)

    async function load() {
        loading = true
        error = ''
        try {
            const r = await api(`/items/${id}`)
            item = r.item
            const s = await api(`/items/${id}/timeslots`)
            slots = s.items || []
        } catch (e) {
            error = e.message || 'failed to load'
        }
        loading = false
    }

    async function reserve() {
        if (!auth.value) { location.href = '/login'; return }
        if (!selectedSlot) { toast('Choose a time slot'); return }
        try {
            await api('/reservations', {
                method: 'POST',
                needsAuth: true,
                body: {
                    tableIds: [Number(id)],
                    timeSlotId: selectedSlot,
                    partySize: 2
                }
            })
            toast('Reservation confirmed!')
            location.href = '/me/reservations'
        } catch (e) {
            toast(e.message || 'Failed to reserve')
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
        <div class="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div class="h-56 w-full overflow-hidden">
                <img
                        src="https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1200&auto=format&fit=crop"
                        alt=""
                        class="h-full w-full object-cover"
                />
            </div>
            <div class="grid gap-4 p-5">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <h2 class="text-2xl font-semibold">{item.name}</h2>
                        <div class="mt-1 text-sm text-neutral-600">{item.location}</div>
                        <div class="mt-1 text-sm text-neutral-600">Seats: {item.capacity}</div>
                    </div>
                    <a href="/tables" class="rounded-xl border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">Back</a>
                </div>

                <div class="grid gap-2">
                    <label class="text-sm text-neutral-700">Choose time</label>
                    <select bind:value={selectedSlot} class="w-full rounded-xl border border-neutral-300 p-2">
                        <option value="">Choose time</option>
                        {#each slots as s}
                            <option value={s.id} disabled={!s.available}>
                                {new Date(s.start).toLocaleString()}
                                {s.available ? '' : ' (taken)'}
                            </option>
                        {/each}
                    </select>
                </div>

                <button
                        on:click={reserve}
                        class="rounded-xl bg-black px-5 py-2.5 text-white hover:bg-neutral-800 disabled:opacity-50"
                        disabled={!selectedSlot}
                >
                    Reserve
                </button>
            </div>
        </div>
    {/if}
</div>
