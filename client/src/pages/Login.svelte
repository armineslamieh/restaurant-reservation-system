<script>
    import { api } from '../lib/api.js'
    import { auth } from '../lib/stores/auth.js'
    import Card from '../lib/ui/Card.svelte'
    import Input from '../lib/ui/Input.svelte'
    import Button from '../lib/ui/Button.svelte'
    import Spinner from '../lib/ui/Spinner.svelte'

    let email = ''
    let password = ''
    let error = ''
    let loading = false

    function validate() {
        const e = email.trim()
        const p = password
        if (!e || !p) return 'Email and password are required'
        if (!e.includes('@')) return 'Please enter a valid email'
        if (p.length < 6) return 'Password must be at least 6 characters'
        return ''
    }

    async function submit() {
        if (loading) return
        error = validate()
        if (error) return
        loading = true
        try {
            const res = await api('/auth/login', { method: 'POST', body: { email: email.trim(), password } })
            auth.login({ token: res.token, user: res.user })
            location.href = '/'
        } catch (e) {
            error = e.message
        } finally {
            loading = false
        }
    }
</script>

<div class="mx-auto grid max-w-md gap-4">
    <h2 class="text-2xl font-semibold">Login</h2>
    <Card>
        <form on:submit|preventDefault={submit} class="grid gap-3">
            <div class="grid gap-1.5">
                <label for="email" class="text-sm text-neutral-700">Email</label>
                <Input id="email" type="email" bind:value={email} required />
            </div>
            <div class="grid gap-1.5">
                <label for="password" class="text-sm text-neutral-700">Password</label>
                <Input id="password" type="password" bind:value={password} required />
            </div>
            {#if error}<p class="text-sm text-red-600">{error}</p>{/if}
            <Button type="submit" disabled={loading}>
                {#if loading}<Spinner />{/if}
                {loading ? 'Signing in...' : 'Login'}
            </Button>
        </form>
    </Card>
</div>
