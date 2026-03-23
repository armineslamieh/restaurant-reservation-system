import { sequelize, Reservation, Table, TimeSlot, ReservationTable, Setting } from '../db/models.js'

export async function ensureRules({ userId, tableIds, timeSlotId, partySize }) {
    const setting = await Setting.findOne({ where: { key: 'maxReservationsPerUser' } })
    const maxActive = setting ? Number(setting.value) : 5
    const activeCount = await Reservation.count({ where: { userId, status: 'active' } })
    if (activeCount >= maxActive) throw new Error(`max ${maxActive} active reservations reached`)
    const tables = await Table.findAll({ where: { id: tableIds, active: true } })
    const capacity = tables.reduce((a, t) => a + t.capacity, 0)
    if (capacity < partySize) throw new Error('insufficient capacity')
    const ts = await TimeSlot.findByPk(timeSlotId)
    if (!ts) throw new Error('invalid time slot')
}

export async function createReservation({ userId, tableIds, timeSlotId, partySize, notes }) {
    return await sequelize.transaction(async (t) => {
        await ensureRules({ userId, tableIds, timeSlotId, partySize })
        const conflicts = await Reservation.findAll({
            where: { timeSlotId, status: 'active' },
            include: [{ model: Table, as: 'tables', where: { id: tableIds }, required: true }],
            transaction: t
        })
        if (conflicts.length > 0) throw new Error('already reserved')
        const reservation = await Reservation.create({ userId, timeSlotId, partySize, notes }, { transaction: t })
        const rows = tableIds.map(id => ({ reservationId: reservation.id, tableId: id }))
        await ReservationTable.bulkCreate(rows, { transaction: t })
        return reservation
    })
}

export async function cancelReservation({ reservationId, userId, asAdmin = false }) {
    const where = asAdmin ? { id: reservationId } : { id: reservationId, userId }
    const r = await Reservation.findOne({ where })
    if (!r) throw new Error('not found')
    const ts = await TimeSlot.findByPk(r.timeSlotId)
    const start = new Date(ts.start).getTime()
    const now = Date.now()
    if (start - now < 24 * 60 * 60 * 1000) throw new Error('too late to cancel')
    r.status = 'cancelled'
    await r.save()
    return r
}
