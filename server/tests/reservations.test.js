import { describe, test, expect } from 'vitest'
import request from 'supertest'
import app from '../src/index.js'

describe('reservations', () => {
    test('rejects when unauthenticated', async () => {
        const res = await request(app).post('/reservations').send({
            tableIds: ['t1'],
            timeSlotId: 'slot1',
            partySize: 2
        })
        expect([401, 400]).toContain(res.status)
    })
})
