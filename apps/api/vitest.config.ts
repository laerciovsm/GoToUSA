import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

// O SWC gera os metadados dos decoradores, de que o NestJS precisa para a injeção de dependências.
export default defineConfig({
  plugins: [swc.vite({ module: { type: "es6" } })],
  test: { include: ["src/**/*.test.ts"] },
});
