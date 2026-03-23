<script>
    const hero =
        'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1600&auto=format&fit=crop'
    const interior =
        'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop'
    const kitchen =
        'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop'

    function onErr(e) {
        e.currentTarget.src =
            'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1200&auto=format&fit=crop'
    }
</script>

<div class="fade-in">
    <!-- Hero -->
    <section class="relative mb-12 overflow-hidden rounded-3xl">
        <img src={hero} alt="" class="absolute inset-0 h-full w-full object-cover" on:error={onErr} />
        <div class="absolute inset-0 bg-black/40"></div>
        <div class="relative z-10 mx-auto max-w-5xl px-6 py-24 text-white">
            <h1 class="text-4xl font-bold md:text-5xl">Our Story</h1>
            <p class="mt-3 max-w-2xl text-neutral-200">
                A celebration of honest cooking, good wine, and heartfelt hospitality in the heart of the city.
            </p>
        </div>
    </section>

    <!-- Story -->
    <section class="mx-auto max-w-5xl px-6">
        <div class="grid gap-10 md:grid-cols-2 md:gap-16">
            <div>
                <h2 class="text-2xl font-semibold">Noir Bistro</h2>
                <p class="mt-4 text-neutral-700 leading-relaxed">
                    Founded in 2020, Noir Bistro brings a touch of European warmth and simplicity to our vibrant city.
                    Our philosophy is rooted in seasonality, local produce, and a love of great conversation.
                    Every dish is prepared with attention to detail — from the hand-cut pasta to the house-fermented bread.
                </p>
                <p class="mt-4 text-neutral-700 leading-relaxed">
                    The dining room blends natural textures, low lighting, and an open kitchen, creating an atmosphere that feels both intimate and alive.
                    Whether it’s a quiet dinner for two or a table full of laughter, we aim to make every visit memorable.
                </p>
            </div>
            <div class="overflow-hidden rounded-2xl">
                <img src={interior} alt="Interior" class="h-full w-full object-cover" on:error={onErr} />
            </div>
        </div>
    </section>

    <!-- Philosophy -->
    <section class="mx-auto mt-16 max-w-5xl px-6">
        <div class="grid gap-10 md:grid-cols-2 md:gap-16">
            <div class="overflow-hidden rounded-2xl order-2 md:order-1">
                <img src={kitchen} alt="Kitchen" class="h-full w-full object-cover" on:error={onErr} />
            </div>
            <div class="order-1 md:order-2">
                <h2 class="text-2xl font-semibold">Our Philosophy</h2>
                <p class="mt-4 text-neutral-700 leading-relaxed">
                    At Noir Bistro, we believe that food is a language — one that connects people.
                    Our chefs work closely with farmers, fishermen, and foragers to bring the best ingredients to the table.
                    We embrace slow food values, minimal waste, and a balance between comfort and creativity.
                </p>
                <p class="mt-4 text-neutral-700 leading-relaxed">
                    Our wine list focuses on natural, small-producer bottles from across Europe, chosen to pair perfectly with our ever-evolving menu.
                    The bar serves a refined list of classic and house cocktails, balancing modern technique with timeless taste.
                </p>
            </div>
        </div>
    </section>

    <!-- Call to Action -->
    <section class="mx-auto mt-20 max-w-5xl px-6 text-center">
        <div class="rounded-3xl bg-neutral-900 px-8 py-16 text-white">
            <h2 class="text-3xl font-semibold">Visit Noir Bistro</h2>
            <p class="mt-2 text-neutral-300">Join us for dinner or a glass at the bar.</p>
            <a href="/tables" class="mt-6 inline-block rounded-xl bg-white px-6 py-2.5 text-black hover:bg-neutral-100">
                Reserve a Table
            </a>
        </div>
    </section>
</div>
