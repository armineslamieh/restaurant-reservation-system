<script>
    import { onMount } from 'svelte'
    import { api } from '../../lib/api.js'
    import { auth } from '../../lib/stores/auth.js'

    let value = ''
    let msg = ''
    let error = ''

    onMount(async () => {
        if (!auth.value) { location.href = '/login'; return }
        await load()
    })

    async function load() {
        msg = ''
        error = ''
        try {
            const r = await api('/admin/settings/maxReservationsPerUser', { needsAuth: true })
            value = r.value || ''
        } catch (e) {
            error = e.message || 'failed to load'
        }
    }

    async function save() {
        msg = ''
        error = ''
        try {
            await api('/admin/settings/maxReservationsPerUser', {
                method: 'PUT',
                needsAuth: true,
                body: { value }
            })
            msg = 'Saved'
        } catch (e) {
            error = e.message || 'failed to save'
        }
    }
</script>

<div class="grid gap-6 fade-in">
    <div class="flex items-end justify-between gap-3">
        <h2 class="text-2xl font-semibold">Admin · Settings</h2>
        <a href="/admin" class="rounded-xl border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">Back</a>
    </div>

    <div class="grid gap-4 rounded-2xl border border-neutral-200 p-5">
        <div class="grid gap-2">
            <label class="text-sm font-medium">Max reservations per user</label>
            <input class="w-full rounded-xl border border-neutral-300 p-2" bind:value={value} placeholder="e.g. 5" />
            <div class="text-xs text-neutral-600">Limits how many active reservations a single user may hold.</div>
        </div>
        <div class="flex gap-3">
            <button on:click={save} class="rounded-xl bg-black px-4 py-2 text-white hover:bg-neutral-800">Save</button>
            <button on:click={load} class="rounded-xl border border-neutral-300 px-4 py-2 hover:bg-neutral-50">Reload</button>
        </div>
        {#if msg}<div class="text-sm text-emerald-700">{msg}</div>{/if}
        {#if error}<div class="text-sm text-rose-700">{error}</div>{/if}
    </div>
</div>
