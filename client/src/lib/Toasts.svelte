<script>
    import { toasts } from './toasts.js'
    $: list = $toasts
</script>

<div class="pointer-events-none fixed inset-0 z-50 flex items-start justify-center p-4 sm:justify-end">
    <div class="mt-2 flex w-full max-w-sm flex-col gap-2">
        {#each list as t (t.id)}
            <div class="pointer-events-auto rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-lg">{t.text}</div>
        {/each}
    </div>
</div>
