import "reflect-metadata";
import { LOCALES } from "@gotousa/shared";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module.js";
import { loadRootEnvFile, parseEnv } from "./config/env.js";
import { configureApp } from "./setup.js";

loadRootEnvFile();
const env = parseEnv(process.env);

const app = await NestFactory.create<NestExpressApplication>(AppModule.forRoot(env), { bodyParser: false });
configureApp(app);
await app.listen(env.API_PORT, env.API_HOST);

new Logger("GoToUSA").log(
  `API em http://${env.API_HOST}:${env.API_PORT}/api (só neste PC) · idiomas: ${LOCALES.join(", ")}`,
);
