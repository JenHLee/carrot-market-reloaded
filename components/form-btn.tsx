"use client"; // client component = interactive

import { useFormStatus } from "react-dom";

interface FormButtonProps {
  text: string;
}

export default function FormButton({ text }: FormButtonProps) {
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
