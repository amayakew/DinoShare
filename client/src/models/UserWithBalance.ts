import type { User } from "./User";


export type UserWithBalance = User & {
    balance: number
}