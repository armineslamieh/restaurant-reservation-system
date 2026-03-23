<script>
    import { auth } from './stores/auth.js'
    $: me = $auth.user
    export let active = "/"
</script>

<header class="sticky top-0 z-40 border-b border-neutral-200 bg-white/70 backdrop-blur">
    <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <a href="/" class="text-lg font-bold tracking-tight">Noir Bistro</a>
        <nav class="flex flex-wrap items-center gap-4 text-sm">
            <a href="/menu" class="{active === '/menu' ? 'font-semibold underline' : 'text-neutral-700 hover:text-black'}">Menu</a>
            <a href="/tables" class="{active === '/tables' ? 'font-semibold underline' : 'text-neutral-700 hover:text-black'}">Reserve</a>
            <a href="/about" class="{active === '/about' ? 'font-semibold underline' : 'text-neutral-700 hover:text-black'}">About</a>
            <a href="/contact" class="{active === '/contact' ? 'font-semibold underline' : 'text-neutral-700 hover:text-black'}">Contact</a>
            {#if me}
                <a href="/me/reservations" class="{active === '/me/reservations' ? 'font-semibold underline' : 'text-neutral-700 hover:text-black'}">My reservations</a>
                {#if me.roles && me.roles.includes('admin')}
                    <a href="/admin" class="{active === '/admin' ? 'font-semibold underline' : 'text-neutral-700 hover:text-black'}">Admin</a>
                    <a href="/admin/users" class="{active === '/admin' ? 'font-semibold underline' : 'text-neutral-700 hover:text-black'}">Users</a>
                    <a href="/admin/settings" class="{active === '/admin' ? 'font-semibold underline' : 'text-neutral-700 hover:text-black'}">Settings</a>
                {/if}
                <a href="/login" on:click|preventDefault={() => auth.logout()} class="rounded-xl border border-neutral-300 px-3 py-1.5 hover:bg-neutral-50">Logout</a>
            {:else}
                <a href="/login" class="{active === '/login' ? 'font-semibold underline' : 'text-neutral-700 hover:text-black'}">Login</a>
                <a href="/register" class="rounded-xl bg-black px-3 py-1.5 font-medium text-white hover:bg-neutral-800">Register</a>
            {/if}
        </nav>
    </div>
</header>
