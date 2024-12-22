"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useActionState } from "react";
import { smsLogin } from "./action";

const initialState = {
  token: false,
};

export default function SMSLogin() {
  const [state, dispatch] = useActionState(smsLogin, initialState);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input name="phone" type="text" placeholder="Phone number" required />
        {state.token ? (
          <Input
            name="token"
            type="number"
            min={100000}
            max={999999}
            placeholder="Verification code"
            required
          />
        ) : null}
        <Button text="Verify" />
      </form>
    </div>
  );
}
