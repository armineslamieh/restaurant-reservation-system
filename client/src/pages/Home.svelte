<script>
    const hero =
        'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1600&auto=format&fit=crop'
    const fallback =
        'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1200&auto=format&fit=crop'
    const dishes = [
        {
            title: 'Tagliatelle Funghi',
            desc: 'Hand-cut pasta, wild mushrooms, pecorino',
            price: '18',
            img: 'https://images.unsplash.com/photo-1604908176997-4316514f2cbb?q=80&w=1200&auto=format&fit=crop'
        },
        {
            title: 'Sea Bass à la Plancha',
            desc: 'Fennel, citrus, herb oil',
            price: '24',
            img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop'
        },
        {
            title: 'Ribeye & Peppercorn',
            desc: '300g, pommes frites',
            price: '29',
            img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1600&auto=format&fit=crop\n'
        }
    ]
    const gallery = [
        'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1529694157871-0f254bc42cfd?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1200&auto=format&fit=crop'
    ]
    function onErr(e) { e.currentTarget.src = fallback }
</script>

<section class="relative overflow-hidden rounded-3xl fade-in">
    <img src={hero} alt="" class="absolute inset-0 h-full w-full object-cover" loading="eager" />
    <div class="absolute inset-0 bg-black/40"></div>
    <div class="relative z-10 mx-auto max-w-6xl px-6 py-20 text-white">
        <div class="max-w-2xl">
            <h1 class="text-4xl font-bold tracking-tight md:text-5xl">Noir Bistro</h1>
            <p class="mt-3 text-neutral-200">Modern European dishes, natural wines, and warm service.</p>
            <div class="mt-6 flex gap-3">
                <a href="/tables" class="rounded-xl bg-white px-5 py-2.5 text-black hover:bg-neutral-100">Reserve a table</a>
                <a href="/menu" class="rounded-xl border border-white/70 px-5 py-2.5 hover:bg-white/10">View menu</a>
            </div>
        </div>
    </div>
</section>

<section class="mx-auto mt-10 max-w-6xl px-1">
    <h2 class="mb-4 text-2xl font-semibold">Chef’s Picks</h2>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each dishes as d}
            <a href="/menu" class="group overflow-hidden rounded-2xl border border-neutral-200">
                <div class="overflow-hidden">
                    <img
                            src={d.img}
                            alt={d.title}
                            loading="lazy"
                            decoding="async"
                            on:error={onErr}
                            class="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                </div>
                <div class="grid gap-1 p-4">
                    <div class="flex items-baseline justify-between">
                        <div class="text-lg font-semibold">{d.title}</div>
                        <div class="text-sm text-neutral-600">€{d.price}</div>
                    </div>
                    <div class="text-sm text-neutral-600">{d.desc}</div>
                </div>
            </a>
        {/each}
    </div>
</section>

<section class="mx-auto mt-10 max-w-6xl px-1">
    <div class="rounded-3xl bg-neutral-900 p-8 text-white md:p-12">
        <div class="grid grid-cols-1 items-center gap-6 md:grid-cols-[1.2fr_1fr]">
            <div>
                <h3 class="text-2xl font-semibold">Private Dining</h3>
                <p class="mt-2 text-neutral-300">A hidden room for up to 20 guests. Set menus and wine pairings available.</p>
                <a href="/contact" class="mt-4 inline-block rounded-xl bg-white px-5 py-2.5 text-black hover:bg-neutral-100">Enquire</a>
            </div>
            <div class="aspect-[4/3] w-full overflow-hidden rounded-2xl">
                <img
                        src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop"
                        alt=""
                        loading="lazy"
                        decoding="async"
                        on:error={onErr}
                        class="h-full w-full object-cover"
                />
            </div>
        </div>
    </div>
</section>

<section class="mx-auto mt-10 max-w-6xl px-1">
    <h2 class="mb-4 text-2xl font-semibold">Inside Noir</h2>
    <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
        {#each gallery as g}
            <img src={g} alt="" class="aspect-square w-full rounded-2xl object-cover" loading="lazy" decoding="async" on:error={onErr}/>
        {/each}
    </div>
</section>

<section class="mx-auto mt-10 max-w-6xl px-1">
    <div class="grid gap-6 rounded-3xl border border-neutral-200 p-6 md:grid-cols-3">
        <div>
            <div class="text-lg font-semibold">Hours</div>
            <div class="mt-2 text-sm text-neutral-700">Tue–Sun Lunch 12:00–15:00</div>
            <div class="text-sm text-neutral-700">Tue–Sun Dinner 18:00–22:30</div>
        </div>
        <div>
            <div class="text-lg font-semibold">Address</div>
            <div class="mt-2 text-sm text-neutral-700">123 Market Street, Your City</div>
        </div>
        <div class="self-end">
            <a href="/tables" class="rounded-xl bg-black px-5 py-2.5 text-white hover:bg-neutral-800">Book now</a>
        </div>
    </div>
</section>
