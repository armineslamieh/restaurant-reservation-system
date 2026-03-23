<script>
    let name = ''
    let email = ''
    let message = ''
    function send(e) {
        e.preventDefault()
        name = ''
        email = ''
        message = ''
    }
</script>

<div class="grid gap-6">
    <h2 class="text-2xl font-semibold">Contact</h2>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <form class="grid gap-3" on:submit={send}>
            <input class="rounded-xl border border-neutral-300 p-2" placeholder="Name" bind:value={name} />
            <input class="rounded-xl border border-neutral-300 p-2" placeholder="Email" bind:value={email} />
            <textarea class="min-h-[120px] rounded-xl border border-neutral-300 p-2" placeholder="Message" bind:value={message}></textarea>
            <button class="rounded-xl bg-black px-4 py-2 text-white hover:bg-neutral-800">Send</button>
        </form>
        <div class="rounded-2xl border border-neutral-200">
            <iframe
                    class="h-full min-h-[260px] w-full rounded-2xl"
                    src="https://www.google.com/maps?q=Paris&output=embed"
                    loading="lazy"
            ></iframe>
        </div>
    </div>
</div>
