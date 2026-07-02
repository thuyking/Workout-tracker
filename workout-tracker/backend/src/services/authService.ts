import bcrypt from 'bcryptjs'

import { User } from '../models/User'
import { generateToken } from '../utils/generateToken'

interface AuthInput {
  email: string
  password: string
}

interface RegisterInput extends AuthInput {
  name: string
}

interface AuthResult {
  user: {
    id: string
    name: string
    email: string
  }
  token: string
}

export const registerUser = async ({
  name,
  email,
  password,
}: RegisterInput): Promise<AuthResult> => {
  const existingUser = await User.findOne({ email })

  if (existingUser) {
    throw new Error('Email is already registered')
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token: generateToken(user.id),
  }
}

export const loginUser = async ({
  email,
  password,
}: AuthInput): Promise<AuthResult> => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('Invalid email or password')
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw new Error('Invalid email or password')
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token: generateToken(user.id),
  }
}
