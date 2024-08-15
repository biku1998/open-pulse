/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from "clsx";
// eslint-disable-next-line import/no-unresolved
import { toast as sonnerToast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertToCamelCase = <T>(obj: any): T => {
  if (Array.isArray(obj)) {
    return obj.map(convertToCamelCase) as T;
  } else if (typeof obj === "object" && obj !== null) {
    const result: { [key: string]: any } = {};
    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
          letter.toUpperCase(),
        );
        result[camelKey] = convertToCamelCase(obj[key]);
      }
    }
    return result as T;
  } else {
    return obj;
  }
};

export const toast = sonnerToast;

export const createShortForm = (inputString: string): string => {
  // Split the input string into words
  const words: string[] = inputString.split(" ");

  // Initialize an empty string to store the short form
  let shortForm: string = "";

  // Iterate through each word and append the first letter to the short form
  for (let i = 0; i < Math.min(words.length, 2); i++) {
    const word = words[i];
    if (word.length > 0) {
      shortForm += word[0].toUpperCase();
    }
  }

  return shortForm;
};

export const generateAlphanumericKey = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
};
