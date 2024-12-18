"use client";
import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import { handleForm } from "./actions";
import { useActionState } from "react";

export default function Login() {
  //useFormState => useActionState 
  // 처음에는 action을 호출하면 - initial state와 formData가 호출
  // 그 다음부터는 이전 action에서 return된 state와 formData가 호출됨
  const [state, action] = useActionState(handleForm, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password.</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <FormInput
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={[]}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={[state?.errors ?? []]}
        />
        <FormButton text="LogIn account" />
      </form>
      <SocialLogin />
    </div>
  );
}
