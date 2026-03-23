import { Sequelize, DataTypes, Model } from 'sequelize'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const env = process.env.NODE_ENV || 'dev'
const storage = path.join(__dirname, `../../data-${env}.sqlite`)

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage,
    logging: false
})

export class User extends Model {}
User.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, { sequelize, modelName: 'user' })

export class Role extends Model {}
Role.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
}, { sequelize, modelName: 'role' })

export class Table extends Model {}
Table.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    capacity: { type: DataTypes.INTEGER, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, { sequelize, modelName: 'table' })

export class TimeSlot extends Model {}
TimeSlot.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    start: { type: DataTypes.DATE, allowNull: false },
    end: { type: DataTypes.DATE, allowNull: false }
}, { sequelize, modelName: 'timeSlot' })

export class Reservation extends Model {}
Reservation.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
    partySize: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    notes: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' }
}, { sequelize, modelName: 'reservation' })

export class ReservationTable extends Model {}
ReservationTable.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true }
}, { sequelize, modelName: 'reservationTable' })

export class Setting extends Model {}
Setting.init({
    key: { type: DataTypes.STRING, primaryKey: true },
    value: { type: DataTypes.STRING, allowNull: false }
}, { sequelize, modelName: 'setting' })

export class UserRole extends Model {}
UserRole.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true }
}, { sequelize, modelName: 'userRole' })

User.belongsToMany(Role, { through: UserRole })
Role.belongsToMany(User, { through: UserRole })

Reservation.belongsTo(User, { as: 'user' })
User.hasMany(Reservation, { as: 'reservations', foreignKey: 'userId' })

Reservation.belongsTo(TimeSlot, { as: 'timeSlot' })
TimeSlot.hasMany(Reservation, { as: 'reservations', foreignKey: 'timeSlotId' })

Reservation.belongsToMany(Table, { through: ReservationTable, as: 'tables' })
Table.belongsToMany(Reservation, { through: ReservationTable, as: 'reservations' })

export async function syncDb() {
    await sequelize.sync()
}
