"use client";
import SocialLogin from "@/components/social-login";
import { login } from "./actions";
import { useActionState } from "react";
import Input from "@/components/input";
import Button from "@/components/button";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function Login() {
  //useFormState => useActionState 
  // 처음에는 action을 호출하면 - initial state와 formData가 호출
  // 그 다음부터는 이전 action에서 return된 state와 formData가 호출됨
  const [state, dispatch] = useActionState(login, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password.</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={state?.fieldErrors.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.password}
        />
        <Button text="LogIn account" />
      </form>
      <SocialLogin />
    </div>
  );
}
