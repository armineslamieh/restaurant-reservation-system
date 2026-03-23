<script>
    import { createEventDispatcher } from 'svelte'
    export let id = ''
    export let value
    export let disabled = false
    export let className = ''

    const dispatch = createEventDispatcher()

    function handleChange(e) {
        value = e.currentTarget.value         // keeps bind:value working
        dispatch('change', e)                 // bubble native change
    }

    function handleClick(e) { dispatch('click', e) }
</script>

<select
        {...$$restProps}
        {id}
        bind:value
        {disabled}
        on:change={handleChange}
        on:click={handleClick}
        class={`w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black disabled:opacity-60 ${className}`}
>
    <slot />
</select>
