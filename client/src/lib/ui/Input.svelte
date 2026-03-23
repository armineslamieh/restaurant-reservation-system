<script>
    import { createEventDispatcher } from 'svelte'
    export let id = ''
    export let type = 'text'
    export let value = ''
    export let placeholder = ''
    export let required = false
    export let className = ''

    const dispatch = createEventDispatcher()

    function handleInput(e) {
        value = e.currentTarget.value         // keeps bind:value working
        dispatch('input', e)                  // lets parents listen to on:input if they want
        dispatch('change', e)                 // some code listens to change instead of input
    }

    function handleClick(e) { dispatch('click', e) }
</script>

<input
        {...$$restProps}
        {id}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        on:input={handleInput}
        on:click={handleClick}
        class={`w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black ${className}`}
/>
