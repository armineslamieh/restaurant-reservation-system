import dotenv from 'dotenv'
import { syncDb, Table, TimeSlot, Setting, User, Role } from './db/models.js'
import { hashPassword } from './auth/jwt.js'

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'dev'}` })

function slugify(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function upsertRole(name) {
    const [r] = await Role.findOrCreate({ where: { name } })
    return r
}

async function upsertUser({ email, password, name, roles = [] }) {
    let u = await User.findOne({ where: { email } })
    if (!u) {
        const passwordHash = await hashPassword(password)
        u = await User.create({ email, passwordHash, name, active: true })
    }
    if (roles.length) {
        const rs = []
        for (const rn of roles) rs.push(await upsertRole(rn))
        await u.setRoles(rs)
    }
    return u
}

async function seedSettings() {
    const rows = [
        { key: 'maxReservationsPerUser', value: '5' }
    ]
    for (const r of rows) {
        const [s] = await Setting.findOrCreate({ where: { key: r.key }, defaults: { value: r.value } })
        s.value = r.value
        await s.save()
    }
}

async function seedTables() {
    const defs = [
        { name: 'Table A1', capacity: 2, location: 'Main Hall' },
        { name: 'Table A2', capacity: 2, location: 'Main Hall' },
        { name: 'Table B1', capacity: 4, location: 'Main Hall' },
        { name: 'Table B2', capacity: 4, location: 'Main Hall' },
        { name: 'Table C1', capacity: 6, location: 'Patio' },
        { name: 'Table C2', capacity: 6, location: 'Patio' }
    ]
    for (const d of defs) {
        const slug = slugify(d.name)
        const [t] = await Table.findOrCreate({ where: { slug }, defaults: { name: d.name, capacity: d.capacity, location: d.location, active: true } })
        t.name = d.name
        t.capacity = d.capacity
        t.location = d.location
        t.active = true
        t.slug = slug
        await t.save()
    }
}

function at(hour, minute, date) {
    const d = new Date(date)
    d.setHours(hour, minute, 0, 0)
    return d
}

async function seedTimeSlots() {
    const now = new Date()
    const startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const slots = []
    for (let i = 0; i < 14; i++) {
        const day = new Date(startDay)
        day.setDate(startDay.getDate() + i)
        const s1 = { start: at(18, 0, day), end: at(20, 0, day) }
        const s2 = { start: at(20, 0, day), end: at(22, 0, day) }
        slots.push(s1, s2)
    }
    for (const s of slots) {
        const [row] = await TimeSlot.findOrCreate({ where: { start: s.start, end: s.end }, defaults: { start: s.start, end: s.end } })
        row.start = s.start
        row.end = s.end
        await row.save()
    }
}

async function main() {
    await syncDb()
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123'
    await upsertRole('admin')
    await upsertRole('user')
    await upsertUser({ email: adminEmail, password: adminPass, name: 'Admin', roles: ['admin', 'user'] })
    await seedSettings()
    await seedTables()
    await seedTimeSlots()
    process.exit(0)
}

main()
