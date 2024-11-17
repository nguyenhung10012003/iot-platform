import { AccessTokenGuard } from "@app/common/guards";
import { Body, Controller, Post, Query, UseGuards, Get } from "@nestjs/common";
import { AutomationService } from "./automation.service";
import { CreateAutomationDto } from "./dto/create-automation.dto";

@Controller("automation")
@UseGuards(AccessTokenGuard)
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}
  @Post()
  async createAutomation(@Body() data: CreateAutomationDto) {
    return this.automationService.createAutomation(data);
  }

  @Get()
  async getAutomations(@Query("locationId") locationId: string) {
    return this.automationService.getAutomations({ locationId });
  }
}