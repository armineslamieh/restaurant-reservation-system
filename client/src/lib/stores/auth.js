import { writable } from 'svelte/store'

function createAuth() {
    const start = JSON.parse(localStorage.getItem('auth') || 'null') || { token: null, user: null }
    const store = writable(start)
    const { subscribe, set } = store
    return {
        subscribe,
        get value() { let v; store.subscribe(x => v = x)(); return v },
        login(payload) { set(payload); localStorage.setItem('auth', JSON.stringify(payload)) },
        logout() { set({ token: null, user: null }); localStorage.removeItem('auth') }
    }
}
export const auth = createAuth()
