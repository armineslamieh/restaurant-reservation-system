<script>
    import { onMount } from 'svelte'
    import { api } from '../../lib/api.js'
    import { auth } from '../../lib/stores/auth.js'

    let users = []
    let items = []
    let rows = []
    let userId = ''
    let itemId = ''
    let status = ''
    let rid = ''
    let sort = 'createdAt'
    let dir = 'DESC'
    let limit = 50
    let offset = 0
    let loading = true
    let error = ''

    onMount(async () => {
        if (!auth.value) { location.href = '/login'; return }
        await preload()
        const url = new URL(location.href)
        const iid = url.searchParams.get('itemId')
        if (iid) itemId = iid
        await search()
    })

    async function preload() {
        try {
            const [u, t] = await Promise.all([
                api('/admin/users', { needsAuth: true }),
                api('/admin/tables', { needsAuth: true })
            ])
            users = u.items || []
            items = t.items || []
        } catch (e) {
            error = e.message || 'failed to load'
        }
    }

    async function search() {
        loading = true
        error = ''
        try {
            const r = await api('/admin/reservations', { needsAuth: true, params: { id: rid, userId, itemId, status, sort, dir, limit, offset } })
            rows = r.items || []
        } catch (e) {
            error = e.message || 'failed to load'
        }
        loading = false
    }

    function time(t) { return new Date(t).toLocaleString() }
</script>

<div class="grid gap-6 fade-in">
    <div class="flex items-end justify-between gap-3">
        <h2 class="text-2xl font-semibold">Admin · Reservations</h2>
        <a href="/admin" class="rounded-xl border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">Back</a>
    </div>

    <div class="grid gap-4 rounded-2xl border border-neutral-200 p-5">
        <div class="grid gap-3 sm:grid-cols-4">
            <select class="rounded-xl border border-neutral-300 p-2" bind:value={userId}>
                <option value=''>All users</option>
                {#each users as u}<option value={u.id}>{u.name || u.email}</option>{/each}
            </select>
            <select class="rounded-xl border border-neutral-300 p-2" bind:value={itemId}>
                <option value=''>All items</option>
                {#each items as it}<option value={it.id}>{it.name}</option>{/each}
            </select>
            <select class="rounded-xl border border-neutral-300 p-2" bind:value={status}>
                <option value=''>All statuses</option>
                <option value='active'>active</option>
                <option value='cancelled'>cancelled</option>
            </select>
            <input class="rounded-xl border border-neutral-300 p-2" bind:value={rid} placeholder="Reservation ID" />
        </div>

        <div class="flex flex-wrap gap-3">
            <button on:click={search} class="rounded-xl bg-black px-4 py-2 text-white hover:bg-neutral-800">Search</button>
            <button on:click={() => { userId=''; itemId=''; status=''; rid=''; search() }} class="rounded-xl border border-neutral-300 px-4 py-2 hover:bg-neutral-50">Reset</button>
        </div>
    </div>

    {#if loading}
        <p>Loading…</p>
    {:else if error}
        <p class="text-rose-700">{error}</p>
    {:else}
        <div class="grid gap-3">
            {#each rows as r}
                <div class="rounded-2xl border border-neutral-200 p-4">
                    <div class="flex items-center justify-between">
                        <div class="grid">
                            <div class="text-lg font-semibold">#{r.id}</div>
                            <div class="text-sm text-neutral-700">{time(r.timeSlot?.start)} – {time(r.timeSlot?.end)}</div>
                            <div class="text-sm text-neutral-700">User: {r.user?.name || r.user?.email}</div>
                            <div class="text-sm text-neutral-700">Tables: {(r.tables || []).map(t => t.name).join(', ')}</div>
                        </div>
                        <span class="rounded-xl border border-neutral-300 px-2 py-1 text-xs text-neutral-700">{r.status}</span>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
