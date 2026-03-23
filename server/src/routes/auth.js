import { Router } from 'express'
import { User, Role } from '../db/models.js'
import { signToken, hashPassword, comparePassword } from '../auth/jwt.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/auth/register', async (req, res) => {
    const { email, password, name } = req.body || {}
    if (!email || !password || !name) return res.status(400).json({ message: 'missing fields' })
    try {
        const passwordHash = await hashPassword(password)
        const user = await User.create({ email, passwordHash, name, active: true })
        const [role] = await Role.findOrCreate({ where: { name: 'user' } })
        await user.addRole(role)
        res.status(201).json({ id: user.id, email: user.email, name: user.name })
    } catch (e) {
        const msg = String(e.message || '')
        if (msg.includes('UNIQUE') || msg.includes('unique')) return res.status(409).json({ message: 'email already used' })
        res.status(500).json({ message: 'server error' })
    }
})

router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body || {}
    const user = await User.findOne({ where: { email }, include: Role })
    if (!user) return res.status(401).json({ message: 'invalid credentials' })
    const ok = await comparePassword(password, user.passwordHash)
    if (!ok) return res.status(401).json({ message: 'invalid credentials' })
    if (!user.active) return res.status(403).json({ message: 'user deactivated' })
    const token = signToken({ sub: user.id, roles: user.roles.map(r => r.name) })
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, roles: user.roles.map(r => r.name) } })
})

router.put('/me', requireAuth, async (req, res) => {
    const { name, password } = req.body || {}
    const user = await User.findByPk(req.user.id)
    if (!user) return res.status(404).json({ message: 'not found' })
    if (!name && !password) return res.status(400).json({ message: 'nothing to update' })
    if (name) user.name = String(name).trim()
    if (password) user.passwordHash = await hashPassword(password)
    await user.save()
    res.json({ id: user.id, email: user.email, name: user.name })
})

export default router
