"use client"; // client component = interactive

import { useFormStatus } from "react-dom";

interface ButtonProps {
  text: string;
}

export default function Button({ text }: ButtonProps) {
  // only be used child of form (component 내부에서 사용되어야 함)
  // it'll automatically find parent form, 
  // then will figure the form's action status (pending or not)
  const { pending } = useFormStatus(); 
  return (
    <button
      disabled={pending}
      className="primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
    >
      {pending ? "Loading..." : text}
    </button>
  );
}
