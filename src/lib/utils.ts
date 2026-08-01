import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge, type ConfigExtension } from "tailwind-merge"

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "text-style": [{ "text-style": [() => true] }],
      "text-color": [{ "text-color": [() => true] }],
    } as NonNullable<ConfigExtension<string, string>["extend"]>["classGroups"],
  },
})

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs))
}
