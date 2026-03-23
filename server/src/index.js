import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swagger-config.js'
import authRouter from './routes/auth.js'
import itemsRouter from './routes/items.js'
import reservationsRouter from './routes/reservations.js'
import adminRouter from './routes/admin.js'
import { syncDb, Role, User } from './db/models.js'
import { hashPassword } from './auth/jwt.js'

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'dev'}` })

const app = express()

const allow = new Set([
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'http://127.0.0.1:4173'
])

app.use(cors({
    origin: (origin, cb) => cb(null, !origin || allow.has(origin)),
    credentials: true
}))
app.use(express.json())

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/docs.json', (req, res) => res.json(swaggerSpec))

app.use(authRouter)
app.use(itemsRouter)
app.use(reservationsRouter)
app.use(adminRouter)

app.use((req, res) => res.status(404).json({ message: 'not found' }))

const port = Number(process.env.PORT || 3000)

async function start() {
    await syncDb()
    const [adminRole] = await Role.findOrCreate({ where: { name: 'admin' } })
    const [userRole] = await Role.findOrCreate({ where: { name: 'user' } })

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123'

    let admin = await User.findOne({ where: { email: adminEmail } })

    if (!admin) {
        const passwordHash = await hashPassword(adminPass)
        admin = await User.create({
            email: adminEmail,
            passwordHash,
            name: 'Admin',
            active: true
        })
        await admin.addRole(adminRole)
        await admin.addRole(userRole)
    } else {
        if (!admin.active) {
            admin.active = true
            await admin.save()
        }
        const roles = await admin.getRoles()
        const names = roles.map(r => r.name)
        if (!names.includes('admin')) await admin.addRole(adminRole)
        if (!names.includes('user')) await admin.addRole(userRole)
    }

    return app.listen(port, () => {})
}

if (process.env.NODE_ENV !== 'test') {
    start()
}

export default app
export { start }
