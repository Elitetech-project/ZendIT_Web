import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




// Input change function
export const handleChange = <T extends Record<string, any>>(
  e: React.ChangeEvent<HTMLInputElement>,
  setFormValues: React.Dispatch<React.SetStateAction<T>>
) => {
  const { name, value } = e.target;

  if (name === "phoneNumber" && isNaN(Number(value))) return;

  setFormValues((prev) => ({
    ...prev,
    [name]: value,
  }));
};