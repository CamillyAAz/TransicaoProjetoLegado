import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { api } from "@/services/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const cleanCep = (cep: string) => cep.replace(/\D/g, "");

export const isValidCep = (cep: string) => cleanCep(cep).length === 8;

export async function getCepData(cep: string) {
  const c = cleanCep(cep);
  if (!isValidCep(c)) throw new Error("CEP inválido");
  const dados = await api.consultarCEP(c);
  return dados;
}

export function formatCep(value: string) {
  const digits = cleanCep(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}
