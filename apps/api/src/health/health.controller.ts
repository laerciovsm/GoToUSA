import { Controller, Get, Header, ServiceUnavailableException } from "@nestjs/common";
import { HealthService } from "./health.service.js";

export type HealthResponse = { status: "ok"; database: "ok" };

/** GET /api/health: a API e o banco estão de pé? Sem login e sem detalhes internos. */
@Controller("health")
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  @Header("Cache-Control", "no-store")
  async check(): Promise<HealthResponse> {
    if (!(await this.health.isDatabaseUp())) {
      throw new ServiceUnavailableException({ status: "error", database: "unavailable" });
    }
    return { status: "ok", database: "ok" };
  }
}
