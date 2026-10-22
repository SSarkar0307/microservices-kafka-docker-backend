import {z} from 'zod/v3'

export const registerSchema = z.object({
    name: z.string().min(1, "Name is required field"),
    email: z.string().email("Valid email ID is needed"),
    password: z.string().min(6, "Password is required"),
    role: z.string()
})

export const loginSchema = z.object({
    email: z.string().email("Valid email ID is needed"),
    password: z.string().min(6, "Password is required")
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>