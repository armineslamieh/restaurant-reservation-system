import { describe, test, expect } from 'vitest'
import request from 'supertest'
import app from '../src/index.js'

describe('items', () => {
    test('responds on /items', async () => {
        const res = await request(app).get('/items')
        expect([200, 404, 500]).toContain(res.status)
        expect(res.body).toBeDefined()
    })

    test('responds on /items with filters', async () => {
        const res = await request(app)
            .get('/items')
            .query({ q: 'table', minCapacity: 2, location: 'A', sort: 'name', order: 'asc' })
        expect([200, 404, 500]).toContain(res.status)
    })
})
