import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { Reservation, TimeSlot, Table } from '../db/models.js'

const router = Router()

router.post('/reservations', requireAuth, async (req, res) => {
    const { tableIds, timeSlotId, partySize, notes } = req.body || {}
    if (!Array.isArray(tableIds) || !timeSlotId || !partySize) return res.status(400).json({ message: 'missing fields' })
    try {
        const slot = await TimeSlot.findByPk(timeSlotId)
        if (!slot) return res.status(409).json({ message: 'invalid time slot' })
        const r = await Reservation.create({ userId: req.user.id, timeSlotId, partySize: Number(partySize), notes: String(notes || ''), status: 'active' })
        if (tableIds.length) {
            const rows = await Table.findAll({ where: { id: tableIds } })
            await r.setTables(rows)
        }
        res.status(201).json({ id: r.id })
    } catch (e) {
        res.status(422).json({ message: String(e.message || 'cannot create reservation') })
    }
})

router.delete('/reservations/:id', requireAuth, async (req, res) => {
    const id = req.params.id
    const r = await Reservation.findByPk(id, { include: [{ model: TimeSlot, as: 'timeSlot' }] })
    if (!r) return res.status(404).json({ message: 'not found' })
    const isOwner = r.userId === req.user.id
    const isAdmin = req.user.roles.includes('admin')
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'forbidden' })
    const start = new Date(r.timeSlot.start).getTime()
    const now = Date.now()
    const hours24 = 24 * 60 * 60 * 1000
    if (start - now < hours24) return res.status(403).json({ message: 'too late to cancel' })
    r.status = 'cancelled'
    await r.save()
    res.status(204).end()
})

router.get('/reservations/:id', requireAuth, async (req, res) => {
    const item = await Reservation.findByPk(req.params.id, { include: [{ model: TimeSlot, as: 'timeSlot' }, { model: Table, as: 'tables' }] })
    if (!item) return res.status(404).json({ message: 'not found' })
    if (item.userId !== req.user.id && !req.user.roles.includes('admin')) return res.status(403).json({ message: 'forbidden' })
    res.json({ item })
})

router.get('/me/reservations', requireAuth, async (req, res) => {
    const items = await Reservation.findAll({
        where: { userId: req.user.id },
        include: [{ model: TimeSlot, as: 'timeSlot' }, { model: Table, as: 'tables' }],
        order: [['createdAt', 'DESC']]
    })
    res.json({ items })
})

export default router
