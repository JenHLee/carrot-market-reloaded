'use server'

import { z } from "zod"
import validator from "validator" //javascript library 
import { redirect } from "next/navigation";

interface ActionState {
    token: boolean,
}

// const phoneSchema = z.string().trim().refine(validator.isMobilePhone);
const phoneSchema = z.string().trim().refine((phone) => validator.isMobilePhone(phone, "en-CA"), "Wrong phone format");

// user input => formData => number => string 
// 유저가 input하면 formData를 통해 value는 저절로 string으로 바뀜
// 따라서 아래 스키마에 number로 쓰면 작동되지 않음.
// coerce(coercion:강제)는 string을 number로 변환하려고 시도하는 것, 즉 문자는 숫자로 변환 불가
const tokenSchema = z.coerce.number().min(100000).max(999999);

export async function smsLogin(prevState: any, formData: FormData) {
    // console.log(typeof formData.get("token")); // string
    // console.log(typeof tokenSchema.parse(formData.get("token"))) // number

    const phone = formData.get("phone");
    const token = formData.get("token");

    if (!prevState.token) { // first time call this action
        const result = phoneSchema.safeParse(phone);
        if (!result.success) {
            return {
                token: false,
                error: result.error.flatten()
            }
        } else {
            return {
                token: true,
            }
        }
    } else { // second time call this action
        const result = tokenSchema.safeParse(token);
        if (!result.success) {
            return {
                token: true,
                error: result.error.flatten()
            };
        } else {
            redirect("/");
        }
    }
}