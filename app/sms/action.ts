'use server'

import { z } from "zod"
import validator from "validator" //javascript library 

const phoneSchema = z.string().trim().refine(validator.isMobilePhone);

// const tokenSchema = z.string().
export async function smsLogin(prevState: any, formData: FormData) {
    console.log(typeof formData.get("token"));
   
}