import { verifyToken } from '../auth/jwt.js'
import { User, Role } from '../db/models.js'

export async function requireAuth(req, res, next) {
    const h = req.headers.authorization || ''
    const t = h.startsWith('Bearer ') ? h.slice(7) : null
    if (!t) return res.status(401).json({ message: 'unauthenticated' })
    try {
        const d = verifyToken(t)
        const user = await User.findByPk(d.sub, { include: [{ model: Role }] })
        if (!user) return res.status(401).json({ message: 'unauthenticated' })
        if (!user.active) return res.status(403).json({ message: 'user deactivated' })
        req.user = { id: user.id, roles: user.roles.map(r => r.name) }
        next()
    } catch {
        res.status(401).json({ message: 'invalid or expired token' })
    }
}

export function requireRole(name) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: 'unauthenticated' })
        if (!req.user.roles.includes(name)) return res.status(403).json({ message: 'forbidden' })
        next()
    }
}
