"use client";

import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  label: string;
  loadingLabel?: string;
  className?: string;
}

export default function SubmitButton({ 
  label, 
  loadingLabel = "Menyimpan...", 
  className = "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mt-2" 
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`${className} ${pending ? "opacity-50 cursor-not-allowed" : ""} transition-all`}
    >
      {pending ? loadingLabel : label}
    </button>
  );
}