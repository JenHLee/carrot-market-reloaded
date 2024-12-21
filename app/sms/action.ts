'use server'

import { z } from "zod"
import validator from "validator" //javascript library 

const phoneSchema = z.string().trim().refine(validator.isMobilePhone);

// user input => formData => number => string 
// 유저가 input하면 formData를 통해 value는 저절로 string으로 바뀜
// 따라서 아래 스키마에 number로 쓰면 작동되지 않음.
// coerce(coercion:강제)는 string을 number로 변환하려고 시도하는 것, 즉 문자는 숫자로 변환 불가
const tokenSchema = z.coerce.number();

export async function smsLogin(prevState: any, formData: FormData) {
    console.log(typeof formData.get("token"));
   
}