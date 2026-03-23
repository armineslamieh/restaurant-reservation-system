<script>
    import { createEventDispatcher } from 'svelte'
    export let type = 'button'
    export let variant = 'primary'
    export let disabled = false
    export let className = ''

    const dispatch = createEventDispatcher()
    function handleClick(e) { dispatch('click', e) }
</script>

<button
        {...$$restProps}
        {type}
        {disabled}
        on:click={handleClick}
        class={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-[.98]
  disabled:opacity-60 disabled:cursor-not-allowed
  ${variant === 'primary' ? 'bg-black text-white hover:bg-neutral-800' : ''}
  ${variant === 'outline' ? 'border border-neutral-300 hover:bg-neutral-50' : ''}
  ${variant === 'danger' ? 'bg-red-600 text-white hover:bg-red-500' : ''}
  ${className}`}
>
    <slot />
</button>
