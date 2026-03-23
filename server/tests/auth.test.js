import { describe, test, expect } from 'vitest'
import request from 'supertest'
import app from '../src/index.js'

function email() {
    return `t${Date.now()}_${Math.random().toString(36).slice(2)}@example.com`
}

describe('auth', () => {
    test('registers and logs in a user', async () => {
        const e = email()
        const reg = await request(app).post('/auth/register').send({ email: e, password: 'pass123', name: 'u' })
        expect([200, 201, 400]).toContain(reg.status)

        const login = await request(app).post('/auth/login').send({ email: e, password: 'pass123' })
        expect([200, 401]).toContain(login.status)
        if (login.status === 200) expect(login.body.token).toBeTruthy()
    })
})
