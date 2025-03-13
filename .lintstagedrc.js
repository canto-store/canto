export default {
  // Run type-check on TypeScript files
  "**/*.{ts,tsx}": () => "pnpm tsc --noEmit",

  // Run ESLint on JS, TS, and TSX files
  "**/*.{js,jsx,ts,tsx}": ["pnpm eslint --fix"],

  // Run Prettier on all supported files
  "**/*.{js,jsx,ts,tsx,css,md,json}": ["pnpm prettier --write"],
};
