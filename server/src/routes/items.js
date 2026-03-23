import { Router } from 'express'
import { Op } from 'sequelize'
import { Table, TimeSlot, Reservation } from '../db/models.js'

const router = Router()

router.get('/items', async (req, res) => {
    const { q, minCapacity, location, sort = 'name', order = 'ASC', limit = 50, offset = 0 } = req.query
    const where = { active: true }
    if (q) where.name = { [Op.like]: `%${q}%` }
    if (minCapacity) where.capacity = { [Op.gte]: Number(minCapacity) }
    if (location) where.location = { [Op.like]: `%${location}%` }
    const rows = await Table.findAll({ where, order: [[sort, order]], limit: Number(limit), offset: Number(offset) })
    const items = rows.map(t => ({ id: t.id, slug: t.slug, name: t.name, capacity: t.capacity, location: t.location, active: t.active }))
    res.json({ items })
})

router.get('/items/:id', async (req, res) => {
    const t = await Table.findByPk(req.params.id)
    if (!t || !t.active) return res.status(404).json({ message: 'not found' })
    const item = { id: t.id, slug: t.slug, name: t.name, capacity: t.capacity, location: t.location, active: t.active }
    res.json({ item })
})

router.get('/items/:id/timeslots', async (req, res) => {
    const tableId = req.params.id
    const slots = await TimeSlot.findAll()
    const activeRes = await Reservation.findAll({
        where: { status: 'active' },
        include: [{ model: Table, as: 'tables', where: { id: tableId }, required: true }]
    })
    const taken = new Set(activeRes.map(r => r.timeSlotId))
    const items = slots.map(s => ({ id: s.id, start: s.start, end: s.end, available: !taken.has(s.id) }))
    res.json({ items })
})

export default router
