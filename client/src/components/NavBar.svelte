<script>
    import page from 'page'
    import { auth } from '../lib/stores/auth.js'
    $: me = $auth.user
</script>

<nav style="border-bottom:1px solid #e5e7eb;padding:.8rem 1rem;display:flex;gap:1rem;align-items:center;justify-content:space-between;">
    <div style="display:flex;gap:1rem;align-items:center;">
        <a href="/" on:click|preventDefault={() => page('/')}>🍽️ Reservations</a>
        {#if me?.roles?.includes('admin')}
            <a href="/admin/tables" on:click|preventDefault={() => page('/admin/tables')}>Admin</a>
        {/if}
    </div>
    <div style="display:flex;gap:.6rem;align-items:center;">
        {#if me}
            <a href="/me/reservations" on:click|preventDefault={() => page('/me/reservations')}>My reservations</a>
            <span>|</span>
            <button class="btn" on:click={() => { auth.logout(); page('/login') }}>Logout</button>
        {:else}
            <a href="/login" on:click|preventDefault={() => page('/login')}>Login</a>
            <a href="/register" on:click|preventDefault={() => page('/register')}>Register</a>
        {/if}
    </div>
</nav>
