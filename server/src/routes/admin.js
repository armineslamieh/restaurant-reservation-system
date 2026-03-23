import { Router } from 'express'
import { Op } from 'sequelize'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { Table, TimeSlot, Setting, User, Role, Reservation } from '../db/models.js'

const router = Router()
router.use(requireAuth, requireRole('admin'))

function slugify(s) {
    return String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'table'
}

async function getUniqueSlug(base) {
    let slug = base
    let i = 2
    while (await Table.findOne({ where: { slug } })) {
        slug = `${base}-${i++}`
    }
    return slug
}

router.get('/admin/tables', async (req, res) => {
    const { q, minCapacity, location, sort = 'name', order = 'ASC', limit = 50, offset = 0 } = req.query || {}
    const where = {}
    if (q) where.name = { [Op.like]: `%${q}%` }
    if (minCapacity) where.capacity = { [Op.gte]: Number(minCapacity) }
    if (location) where.location = { [Op.like]: `%${location}%` }
    const rows = await Table.findAll({ where, order: [[sort, order]], limit: Number(limit), offset: Number(offset) })
    const items = rows.map(t => ({ id: t.id, name: t.name, capacity: t.capacity, location: t.location }))
    res.json({ items })
})

router.post('/admin/tables', async (req, res) => {
    const { name, capacity, location } = req.body || {}
    if (!name || !capacity) return res.status(400).json({ message: 'missing fields' })
    const baseSlug = slugify(name)
    const slug = await getUniqueSlug(baseSlug)
    const item = await Table.create({ name: String(name), slug, capacity: Number(capacity), location: String(location || '') })
    res.status(201).json({ item })
})

router.delete('/admin/tables/:id', async (req, res) => {
    const item = await Table.findByPk(req.params.id)
    if (!item) return res.status(404).json({ message: 'not found' })
    const has = await Reservation.count({ include: [{ model: Table, as: 'tables', where: { id: item.id }, required: true }] })
    if (has > 0) return res.status(409).json({ message: 'cannot delete: has reservations' })
    await item.destroy()
    res.status(204).end()
})

router.get('/admin/timeslots', async (req, res) => {
    const items = await TimeSlot.findAll({ order: [['start', 'ASC']] })
    res.json({ items })
})

router.post('/admin/timeslots', async (req, res) => {
    const { start, end } = req.body || {}
    if (!start || !end) return res.status(400).json({ message: 'missing fields' })
    const s = new Date(start)
    const e = new Date(end)
    if (isNaN(s) || isNaN(e) || e <= s) return res.status(400).json({ message: 'invalid time range' })
    const item = await TimeSlot.create({ start: s, end: e })
    res.status(201).json({ item })
})

router.delete('/admin/timeslots/:id', async (req, res) => {
    const item = await TimeSlot.findByPk(req.params.id)
    if (!item) return res.status(404).json({ message: 'not found' })
    const has = await Reservation.count({ where: { timeSlotId: item.id } })
    if (has > 0) return res.status(409).json({ message: 'cannot delete: has reservations' })
    await item.destroy()
    res.status(204).end()
})

router.get('/admin/users', async (req, res) => {
    const { q } = req.query || {}
    const where = q ? { name: { [Op.like]: `%${q}%` } } : {}
    const items = await User.findAll({ where, include: [{ model: Role }] })
    res.json({ items })
})

router.get('/admin/users/:id', async (req, res) => {
    const item = await User.findByPk(req.params.id, { include: [{ model: Role }] })
    if (!item) return res.status(404).json({ message: 'not found' })
    res.json({ item })
})

router.patch('/admin/users/:id/active', async (req, res) => {
    const { active } = req.body || {}
    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ message: 'not found' })
    if (active == null) return res.status(400).json({ message: 'missing fields' })
    user.active = !!active
    await user.save()
    res.json({ id: user.id, active: user.active })
})

router.get('/admin/reservations', async (req, res) => {
    const { id, userId, itemId, status, sort = 'createdAt', dir = 'DESC', limit = 50, offset = 0 } = req.query || {}
    const where = {}
    if (id) where.id = id
    if (status) where.status = status
    if (userId) where.userId = userId
    const include = [
        { model: TimeSlot, as: 'timeSlot' },
        { model: User, as: 'user' },
        { model: Table, as: 'tables', through: { attributes: [] } }
    ]
    const rows = await Reservation.findAll({ where, include, order: [[sort, dir]], limit: Number(limit), offset: Number(offset), distinct: true })
    const items = itemId ? rows.filter(r => r.tables.some(t => String(t.id) === String(itemId))) : rows
    res.json({ items })
})

router.get('/admin/settings/maxReservationsPerUser', async (req, res) => {
    const s = await Setting.findByPk('maxReservationsPerUser')
    res.json({ key: 'maxReservationsPerUser', value: s ? s.value : '' })
})

router.put('/admin/settings/maxReservationsPerUser', async (req, res) => {
    const { value } = req.body || {}
    const [s] = await Setting.findOrCreate({ where: { key: 'maxReservationsPerUser' }, defaults: { value: String(value ?? '') } })
    s.value = String(value ?? '')
    await s.save()
    res.json({ key: 'maxReservationsPerUser', value: s.value })
})

export default router
