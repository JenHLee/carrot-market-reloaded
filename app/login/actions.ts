"use server";
import bcrypt  from 'bcrypt';
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import getSession from '@/lib/session';
import { redirect } from 'next/navigation';

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    }
  })
  return Boolean(user) // return if user O => true / X => false
}

const formSchema = z.object({
  email: z.string({
    required_error: "Password is required"
  }).email().toLowerCase().refine(await checkEmailExists, "An account with this email does not exist."),
  password: z.string()
  // .min(PASSWORD_MIN_LENGTH)
  // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
})


export async function login(prevState: any,
  formData: FormData) {
  console.log(prevState);
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const result = await formSchema.spa(data); // spa === safeParseAsync
  if (!result.success) {
    return result.error.flatten();
  } else {
    // find the user with the email
    // if the user is found, check password hash
    const user = await db.user.findUnique({
      where: {
        email: result.data.email
      },
      select: {
        id: true,
        password: true
      }
    })

    // compare password that user sent us vs hashed password in DB
    const ok = await bcrypt.compare(result.data.password, user!.password ?? "xxxx")
    console.log("ok: ", ok);
    // log the user in
    if(ok) {
      const session = await getSession();
      session.id = user!.id
      redirect("/profile")
    } else {
      // Zod인척 Error return
      return {
        fieldErrors: {
          password:["Wrong password."],
          email: []
        }
      }
    }
    // redirect "/profile"
    console.log(result.data)
  }
}