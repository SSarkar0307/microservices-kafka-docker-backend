import { AppError, getPool, signToken } from "shared";
import { LoginInput, RegisterInput } from "../schemas/auth.schemas";
import { createUser, findByEmail, findById } from "../repositories/user.repo";
import bcrypt from 'bcryptjs'
import { convertToPublicUser } from "../utils/auth.utils";


export async function register(input: RegisterInput){
    const existing = await findByEmail(input.email);

    if(existing){
        console.log("USER FOUND!!!!")
        throw new AppError(409, "Email already registered")
    }

    // console.log("USER FOUND!!!!")

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await createUser({
        name: input.name,
        email: input.email,
        password_hash: passwordHash,
        role : input.role === 'ADMIN' ? "ADMIN" : "USER" 
    })

    return convertToPublicUser(user);
    
}

export async function login(input: LoginInput){
    const user = await findByEmail(input.email);

    if(!user) throw new AppError(401, "Invalid email or password")

    const valid = await bcrypt.compare(input.password, user.password_hash);

    if(!valid) throw new AppError(401, "Invalid email or password")

    const token = signToken({userId: user.id, role: user.role});

    return {
        token,
        user: convertToPublicUser(user)
    }
}

export async function getMe(userId: string){
    const user = await findById(userId)

    if(!user) throw new AppError(404, "User not found");

    return convertToPublicUser(user);
}