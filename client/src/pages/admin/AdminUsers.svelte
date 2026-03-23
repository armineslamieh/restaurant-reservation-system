<script>
    import { onMount } from 'svelte'
    import { api } from '../../lib/api.js'
    import { auth } from '../../lib/stores/auth.js'
    import { toast } from '../../lib/toasts.js'

    let q = ''
    let items = []
    let loading = true
    let error = ''

    onMount(load)

    async function load() {
        loading = true
        error = ''
        try {
            const params = {}
            if (q) params.q = q
            const r = await api('/admin/users', { needsAuth: true, params })
            items = r.items || []
        } catch (e) {
            error = e.message || 'failed to load'
        }
        loading = false
    }

    async function toggleActive(u) {
        try {
            await api(`/admin/users/${u.id}/active`, {
                method: 'PATCH',
                needsAuth: true,
                body: { active: !u.active }
            })
            toast('User updated')
            await load()
        } catch (e) {
            toast(e.message || 'failed to update')
        }
    }
</script>

<div class="grid gap-6 fade-in">
    <div class="flex items-center justify-between gap-4">
        <h2 class="text-2xl font-semibold">Users</h2>
        <a href="/admin" class="rounded-xl border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">Back</a>
    </div>

    {#if !auth.value}
        <p>Please login.</p>
    {:else}
        <div class="grid gap-3 rounded-2xl border border-neutral-200 p-4">
            <div class="flex gap-3">
                <input class="w-full rounded-xl border border-neutral-300 p-2" bind:value={q} placeholder="Search users" />
                <button on:click={load} class="rounded-xl bg-black px-4 py-2 text-white hover:bg-neutral-800">Search</button>
            </div>
        </div>

        {#if loading}
            <p>Loading…</p>
        {:else if error}
            <p class="text-red-600">{error}</p>
        {:else}
            <div class="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <table class="w-full text-left text-sm">
                    <thead class="border-b border-neutral-200 bg-neutral-50">
                    <tr>
                        <th class="p-3">ID</th>
                        <th class="p-3">Name</th>
                        <th class="p-3">Email</th>
                        <th class="p-3">Role</th>
                        <th class="p-3">Active</th>
                        <th class="p-3"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {#each items as u}
                        <tr class="border-b border-neutral-200">
                            <td class="p-3">{u.id}</td>
                            <td class="p-3">{u.name}</td>
                            <td class="p-3">{u.email}</td>
                            <td class="p-3">{u.roles?.join(', ')}</td>
                            <td class="p-3">{u.active ? 'yes' : 'no'}</td>
                            <td class="p-3">
                                <button
                                        on:click={() => toggleActive(u)}
                                        class="rounded-xl border border-neutral-300 px-3 py-1.5 hover:bg-neutral-50"
                                >
                                    {u.active ? 'Deactivate' : 'Activate'}
                                </button>
                            </td>
                        </tr>
                    {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    {/if}
</div>
