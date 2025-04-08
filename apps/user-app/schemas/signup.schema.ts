import {z} from 'zod'

export const userSignUpSchema = z.object({
    name:z.string().min(3, "Enter Name "),
    email : z.string().email("Enter a valid Email"),
    number : z.string().min(10 , "Enter a valid Phone Number").max(10),
    password : z.string().min(6 , "Enter password")
})