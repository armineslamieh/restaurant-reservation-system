import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const SECRET = process.env.JWT_SECRET || 'dev'

export function signToken(payload, opts = {}) {
    return jwt.sign(payload, SECRET, { expiresIn: '2h', ...opts })
}

export function verifyToken(token) {
    return jwt.verify(token, SECRET)
}

export async function hashPassword(plain) {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(plain, salt)
}

export async function comparePassword(plain, hash) {
    return await bcrypt.compare(plain, hash)
}
