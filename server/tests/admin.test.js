import { describe, test, expect } from 'vitest'
import request from 'supertest'
import app from '../src/index.js'

describe('admin', () => {
    test('blocks unauthenticated access to /admin/users', async () => {
        const res = await request(app).get('/admin/users')
        expect([401, 403]).toContain(res.status)
    })
})
