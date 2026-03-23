<script>
    const fallback =
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop'
    const sections = [
        {
            name: 'Starters',
            items: [
                { n: 'House sourdough, cultured butter', p: 6 },
                { n: 'Burrata, tomato, basil oil', p: 12 },
                { n: 'Tuna crudo, citrus, fennel', p: 14 }
            ],
            img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop'
        },
        {
            name: 'Mains',
            items: [
                { n: 'Tagliatelle, wild mushrooms, pecorino', p: 18 },
                { n: 'Sea bass à la plancha, herb oil', p: 24 },
                { n: 'Ribeye, peppercorn, fries', p: 29 }
            ],
            img: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop'
        },
        {
            name: 'Desserts',
            items: [
                { n: 'Chocolate mousse', p: 8 },
                { n: 'Lemon tart', p: 8 }
            ],
            img: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=1200&auto=format&fit=crop'
        },
        {
            name: 'Drinks',
            items: [
                { n: 'Natural wines by the glass', p: 7 },
                { n: 'Classic cocktails', p: 10 }
            ],
            img: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&w=1600&auto=format&fit=crop\n'
        }
    ]
    function onErr(e) { e.currentTarget.src = fallback }
</script>

<div class="grid gap-6 fade-in">
    <h2 class="text-2xl font-semibold">Menu</h2>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        {#each sections as s}
            <div class="overflow-hidden rounded-2xl border border-neutral-200">
                <img
                        src={s.img}
                        alt={s.name}
                        class="h-40 w-full object-cover"
                        loading="lazy"
                        decoding="async"
                        on:error={onErr}
                />
                <div class="p-5">
                    <div class="mb-2 text-lg font-semibold">{s.name}</div>
                    <ul class="space-y-2 text-sm text-neutral-800">
                        {#each s.items as it}
                            <li class="flex justify-between gap-3">
                                <span>{it.n}</span>
                                <span class="text-neutral-600">€{it.p ?? '—'}</span>
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>
        {/each}
    </div>

    <div>
        <a href="/tables" class="rounded-xl bg-black px-5 py-2.5 text-white hover:bg-neutral-800">Reserve a table</a>
    </div>
</div>
