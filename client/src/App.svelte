<script>
    import { onMount } from 'svelte'
    import router from 'page'
    import Header from './lib/Header.svelte'
    import Footer from './lib/Footer.svelte'
    import Toasts from './lib/Toasts.svelte'

    import Home from './pages/Home.svelte'
    import About from './pages/About.svelte'
    import Login from './pages/Login.svelte'
    import Register from './pages/Register.svelte'
    import Tables from './pages/Tables.svelte'
    import TableDetail from './pages/TableDetail.svelte'
    import MyReservations from './pages/MyReservations.svelte'
    import Admin from './pages/Admin.svelte'
    import ReservationDetail from './pages/ReservationDetail.svelte'
    import AdminUsers from './pages/admin/AdminUsers.svelte'
    import AdminSettings from './pages/admin/AdminSettings.svelte'
    import AdminTables from './pages/admin/AdminTables.svelte'
    import AdminTimeslots from './pages/admin/AdminTimeslots.svelte'
    import AdminReservations from './pages/admin/AdminReservations.svelte'
    import Menu from './pages/Menu.svelte'
    import Contact from './pages/Contact.svelte'

    let Page = Home
    let context = {}
    let currentRoute = '/'

    function go(p, c = {}, path = '/') {
        Page = p
        context = c
        currentRoute = path
    }

    onMount(() => {
        router('/', () => go(Home, {}, '/'))
        router('/menu', () => go(Menu, {}, '/menu'))
        router('/about', () => go(About, {}, '/about'))
        router('/contact', () => go(Contact, {}, '/contact'))
        router('/login', () => go(Login, {}, '/login'))
        router('/register', () => go(Register, {}, '/register'))
        router('/tables', () => go(Tables, {}, '/reserve'))
        router('/tables/:id', ctx => go(TableDetail, { params: ctx.params }, '/reserve'))
        router('/me/reservations', () => go(MyReservations, {}, '/me/reservations'))
        router('/reservations/:id', ctx => go(ReservationDetail, { params: ctx.params }, '/me/reservations'))
        router('/admin', () => go(Admin, {}, '/admin'))
        router('/admin/users', () => go(AdminUsers, {}, '/admin'))
        router('/admin/settings', () => go(AdminSettings, {}, '/admin'))
        router('/admin/tables', () => go(AdminTables, {}, '/admin'))
        router('/admin/timeslots', () => go(AdminTimeslots, {}, '/admin'))
        router('/admin/reservations', () => go(AdminReservations, {}, '/admin'))
        router('*', () => go(Home, {}, '/'))
        router.start()
    })

    function needsContext(p) {
        return p === TableDetail || p === ReservationDetail
    }
</script>

<div class="min-h-screen bg-neutral-50">
    <Toasts />
    <Header active={currentRoute} />
    <main class="fade-in mx-auto w-full max-w-6xl px-4 py-8">
        {#if needsContext(Page)}
            <svelte:component this={Page} {context} />
        {:else}
            <svelte:component this={Page} />
        {/if}
    </main>
    <Footer />
</div>
