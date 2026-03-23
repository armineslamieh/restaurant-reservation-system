<script>
    import { onMount } from 'svelte'
    import { api } from '../../lib/api.js'
    import { auth } from '../../lib/stores/auth.js'

    let items = []
    let startDate = ''
    let startTime = ''
    let endDate = ''
    let endTime = ''
    let loading = true
    let error = ''
    let msg = ''

    onMount(async () => {
        if (!auth.value) { location.href = '/login'; return }
        await load()
    })

    async function load() {
        loading = true
        error = ''
        try {
            const r = await api('/admin/timeslots', { needsAuth: true })
            items = r.items || []
        } catch (e) {
            error = e.message || 'failed to load'
        }
        loading = false
    }

    function iso(d, t) {
        if (!d || !t) return ''
        return new Date(`${d}T${t}`).toISOString()
    }

    async function addSlot() {
        msg = ''
        error = ''
        const start = iso(startDate, startTime)
        const end = iso(endDate, endTime)
        try {
            await api('/admin/timeslots', { method: 'POST', needsAuth: true, body: { start, end } })
            startDate = ''
            startTime = ''
            endDate = ''
            endTime = ''
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
            await api(`/admin/timeslots/${id}`, { method: 'DELETE', needsAuth: true })
            msg = 'Deleted'
            await load()
        } catch (e) {
            error = e.message || 'failed to delete'
        }
    }
</script>

<div class="grid gap-6 fade-in">
    <div class="flex items-end justify-between gap-3">
        <h2 class="text-2xl font-semibold">Admin · Timeslots</h2>
        <a href="/admin" class="rounded-xl border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">Back</a>
    </div>

    <div class="grid gap-4 rounded-2xl border border-neutral-200 p-5">
        <div class="grid gap-2 sm:grid-cols-4 sm:gap-3">
            <input type="date" class="rounded-xl border border-neutral-300 p-2" bind:value={startDate} />
            <input type="time" class="rounded-xl border border-neutral-300 p-2" bind:value={startTime} />
            <input type="date" class="rounded-xl border border-neutral-300 p-2" bind:value={endDate} />
            <input type="time" class="rounded-xl border border-neutral-300 p-2" bind:value={endTime} />
        </div>
        <div class="flex gap-3">
            <button on:click={addSlot} class="rounded-xl bg-black px-4 py-2 text-white hover:bg-neutral-800">Add</button>
            <button on:click={load} class="rounded-xl border border-neutral-300 px-4 py-2 hover:bg-neutral-50">Reload</button>
        </div>
        {#if msg}<div class="text-sm text-emerald-700">{msg}</div>{/if}
        {#if error}<div class="text-sm text-rose-700">{error}</div>{/if}
    </div>

    {#if loading}
        <p>Loading…</p>
    {:else}
        <div class="grid gap-3">
            {#each items as s}
                <div class="rounded-2xl border border-neutral-200 p-4">
                    <div class="flex items-center justify-between">
                        <div class="text-neutral-700">{new Date(s.start).toLocaleString()} → {new Date(s.end).toLocaleString()}</div>
                        <button on:click={() => remove(s.id)} class="rounded-xl border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">Delete</button>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
