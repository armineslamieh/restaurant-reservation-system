import { auth } from '../lib/stores/auth.js'

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

export async function api(path, options = {}) {
    const { method = 'GET', body, params, needsAuth = false, timeout = 10000 } = options
    const url = new URL(BASE + path)
    if (params) Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, v))
    const headers = { 'Content-Type': 'application/json' }
    if (needsAuth && auth.value?.token) headers.Authorization = `Bearer ${auth.value.token}`

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)

    let res
    try {
        res = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal
        })
    } finally {
        clearTimeout(timer)
    }

    let data = {}
    try { data = await res.json() } catch {}
    if (!res.ok) {
        const msg =
            data?.message ||
            data?.error ||
            (Array.isArray(data?.errors) && (data.errors[0]?.message || data.errors[0])) ||
            `HTTP ${res.status}`
        throw new Error(msg)
    }
    return data
}
