<script>
    import { onMount } from 'svelte'
    import { api } from '../../lib/api.js'
    import { auth } from '../../lib/stores/auth.js'

    let items = []
    let name = ''
    let capacity = ''
    let location = ''
    let loading = true
    let error = ''
    let msg = ''

    let sQ = ''
    let sMin = ''
    let sLoc = ''

    onMount(async () => {
        if (!auth.value) { location.href = '/login'; return }
        await load()
    })

    async function load() {
        loading = true
        error = ''
        try {
            const params = {}
            if (sQ) params.q = sQ
            if (sMin) params.minCapacity = sMin
            if (sLoc) params.location = sLoc
            const r = await api('/admin/tables', { needsAuth: true, params })
            items = r.items || []
        } catch (e) {
            error = e.message || 'failed to load'
        }
        loading = false
    }

    async function addTable() {
        msg = ''
        error = ''
        try {
            await api('/admin/tables', { method: 'POST', needsAuth: true, body: { name, capacity, location } })
            name = ''
            capacity = ''
            location = ''
            msg = 'Added'
            await load()
        } catch (e) {
            error = e.message || 'failed to add'
        }
    }

    async function remove(id) {
        msg = ''
        error = ''
        try {
            await api(`/admin/tables/${id}`, { method: 'DELETE', needsAuth: true })
            msg = 'Deleted'
            await load()
        } catch (e) {
            error = e.message || 'failed to delete'
        }
    }
</script>

<div class="grid gap-6 fade-in">
    <div class="flex items-end justify-between gap-3">
        <h2 class="text-2xl font-semibold">Admin · Tables</h2>
        <a href="/admin" class="rounded-xl border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">Back</a>
    </div>

    <div class="grid gap-4 rounded-2xl border border-neutral-200 p-5">
        <div class="grid gap-2 sm:grid-cols-3 sm:gap-3">
            <input class="rounded-xl border border-neutral-300 p-2" bind:value={sQ} placeholder="Search by name" />
            <input class="rounded-xl border border-neutral-300 p-2" bind:value={sLoc} placeholder="Location" />
            <input class="rounded-xl border border-neutral-300 p-2" bind:value={sMin} placeholder="Min capacity" />
        </div>
        <div class="flex gap-3">
            <button on:click={load} class="rounded-xl bg-black px-4 py-2 text-white hover:bg-neutral-800">Search</button>
            <button on:click={() => { sQ=''; sLoc=''; sMin=''; load() }} class="rounded-xl border border-neutral-300 px-4 py-2 hover:bg-neutral-50">Reset</button>
        </div>
        {#if error}<div class="text-sm text-rose-700">{error}</div>{/if}
    </div>

    <div class="grid gap-4 rounded-2xl border border-neutral-200 p-5">
        <div class="grid gap-2 sm:grid-cols-3 sm:gap-3">
            <input class="rounded-xl border border-neutral-300 p-2" bind:value={name} placeholder="Name" />
            <input class="rounded-xl border border-neutral-300 p-2" bind:value={capacity} placeholder="Capacity" />
            <input class="rounded-xl border border-neutral-300 p-2" bind:value={location} placeholder="Location" />
        </div>
        <div class="flex gap-3">
            <button on:click={addTable} class="rounded-xl bg-black px-4 py-2 text-white hover:bg-neutral-800">Add</button>
            <button on:click={load} class="rounded-xl border border-neutral-300 px-4 py-2 hover:bg-neutral-50">Reload</button>
        </div>
        {#if msg}<div class="text-sm text-emerald-700">{msg}</div>{/if}
        {#if error}<div class="text-sm text-rose-700">{error}</div>{/if}
    </div>

    {#if loading}
        <p>Loading…</p>
    {:else}
        <div class="grid gap-3">
            {#each items as t}
                <div class="rounded-2xl border border-neutral-200 p-4">
                    <div class="flex items-center justify-between">
                        <div class="grid">
                            <div class="text-lg font-semibold">{t.name}</div>
                            <div class="text-sm text-neutral-600">{t.location} · {t.capacity}</div>
                        </div>
                        <div class="flex items-center gap-2">
                            <a href={`/admin/reservations?itemId=${t.id}`} class="rounded-xl border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">View reservations</a>
                            <button on:click={() => remove(t.id)} class="rounded-xl border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">Delete</button>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
