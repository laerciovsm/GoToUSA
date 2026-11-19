import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

// O SWC gera os metadados dos decoradores, de que o NestJS precisa para a injeção de dependências.
// Não usa o .swcrc (ele exclui os testes do build).
export default defineConfig({
  plugins: [
    swc.vite({
      swcrc: false,
      jsc: {
        parser: { syntax: "typescript", decorators: true },
        transform: { legacyDecorator: true, decoratorMetadata: true, useDefineForClassFields: false },
        target: "es2023",
        keepClassNames: true,
      },
      module: { type: "es6" },
    }),
  ],
  test: { include: ["src/**/*.test.ts"] },
});
