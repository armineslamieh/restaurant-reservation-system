import { writable } from 'svelte/store'
export const toasts = writable([])
export function toast(t) {
    const id = Math.random().toString(36).slice(2)
    toasts.update(x => [...x, { id, text: t }])
    setTimeout(() => toasts.update(x => x.filter(i => i.id !== id)), 2500)
}
