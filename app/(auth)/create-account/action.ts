"use server";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkUsername = (username: string) => !username.includes("potato");
const checkPasswords = ({ password, confirm_password }: { password: string, confirm_password: string }) => password === confirm_password;

const formSchema = z.object({
    username: z.string({
        invalid_type_error: "Username must be a string!",
        required_error: "Where is my username???"
    })
        .toLowerCase()
        .trim()
        // .transform((username) => `🔥${username}`)
        .refine(checkUsername, "No potatos allowed"),
    // .refine(await checkUniqueUsername, "This username is already taken"),
    email: z.string()
        .email()
        .toLowerCase(),
    // .refine(await checkUniqueEmail, "There is an account already registered with the email"),

    password: z.string()
        .min(PASSWORD_MIN_LENGTH)
        .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
})
    .superRefine(async ({ username }, ctx) => {
        const user = await db.user.findUnique({
            where: {
                username,
            },
            select: {
                id: true
            }
        });
        if (user) {
            ctx.addIssue({
                code: 'custom',
                message: "This username is already taken",
                path: ["username"],
                fatal: true // this issue가 치명적임
            })
            return z.NEVER; // 뒤에 다른 refine이 있어도 실행되지 않음 따라서 치명적인 순으로 refine하면 퍼포먼스 향상 (Abort early)
        }
    }).superRefine(async ({ email }, ctx) => {
        const user = await db.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true
            }
        });
        if (user) {
            ctx.addIssue({
                code: 'custom',
                message: "This email is already taken",
                path: ["email"],
                fatal: true // this issue가 치명적임
            })
            return z.NEVER; // 뒤에 다른 refine이 있어도 실행되지 않음 따라서 치명적인 순으로 refine하면 퍼포먼스 향상 (Abort early)
        }
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
        console.log("error: ", result.error.flatten());
        return result.error.flatten();
    } else {

        // the result = there is no email/username
        // hass password // 12345 => hashFunction(12345):Oneway function => random string but can't go opposite way (NEVER)
        const hashedPassword = await bcrypt.hash(result.data.password, 12) // how many time run this algorythm - run 12 times, increase the security
        // console.log("hashedPassword: ", hashedPassword);

        // save the user to db using prisma
        const user = await db.user.create({
            data: {
                username: result.data.username,
                email: result.data.email,
                password: hashedPassword,
            },
            select: {
                id: true
            }
        })
        console.log("user: ", user);
        // log the user in // give the user the session(cookie) (include the info which is {id: } => something random enrypt 암호화)
        // When the user go to different pages // we got session(cookies) with random => decrpyt 복호화
        const session = await getSession();
        session.id = user.id;
        await session.save();

        // redirect user to "/home
        redirect("/profile");
    }
    // console.log(result.data);

}