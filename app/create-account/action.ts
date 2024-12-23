"use server";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";

const checkUsername = (username: string) => !username.includes("potato");

const checkPasswords = ({ password, confirm_password }: { password: string, confirm_password: string }) => password === confirm_password;

// DB와 통신하는 function - Zod 안에서 이루어짐
const checkUniqueUsername = async (username: string) => {
    const user = await db.user.findUnique({
        where: {
            username: username // 유저의 모든 정보를 가지고 오기때문에 유저의 데이터양이 방대하다면 퍼포먼스 좋지 않음
        },
        select: {
            id: true, // 따라서 id만 가져오라고 하는 것: 확인하려는 것 단순히 같은 이름의 유저가 존재하는가 // User should be null
        }
    });
    return !Boolean(user); // Boolean(user) === false => return true (no problem)
}

// DB와 통신하는 function - Zod 안에서 이루어짐
const checkUniqueEmail = async (email: string) => {
    const user = await db.user.findUnique({
        where: {
            email: email
        },
        select: {
            id: true, // User should be null
        }
    })
    return !Boolean(user);
}

const formSchema = z.object({
    username: z.string({
        invalid_type_error: "Username must be a string!",
        required_error: "Where is my username???"
    })
        .toLowerCase()
        .trim()
        // .transform((username) => `🔥${username}`)
        .refine(checkUsername, "No potatos allowed")
        .refine(await checkUniqueUsername, "This username is already taken"),
    email: z.string()
        .email()
        .toLowerCase()
        .refine(await checkUniqueEmail, "There is an account already registered with the email"),

    password: z.string()
        .min(PASSWORD_MIN_LENGTH)
        .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
}).refine(checkPasswords, { message: "Both passwords should be the same!", path: ["confirm_password"] })

export async function createAccount(prevState: any, formData: FormData) {
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirm_password: formData.get("confirm_password")
    };
    const result = await formSchema.safeParseAsync(data); // will await (safeParse / safeParseAsync)
    if (!result.success) {
        return result.error.flatten();
    } else {
        // the result = there is no email/username
        // hass password
        // save the user to db using prisma
        // log the user in
        // redirect user to "/home
    }
    // console.log(result.data);

}