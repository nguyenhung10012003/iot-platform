import { AccessTokenGuard } from '@app/common/guards';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AutomationService } from './automation.service';
import { CreateAutomationDto } from './dto/create-automation.dto';

@Controller('automation')
@UseGuards(AccessTokenGuard)
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}
  @Post()
  async createAutomation(@Body() data: CreateAutomationDto) {
    return this.automationService.createAutomation(data);
  }

  @Get()
  async getAutomations(@Query('locationId') locationId: string) {
    return this.automationService.getAutomations({ locationId });
  }

  @Patch(':id')
  async updateAutomation(
    @Param('id') id: string,
    @Body() data: CreateAutomationDto,
  ) {
    return this.automationService.updateAutomation(id, data);
  }

  @Patch(':id/run')
  async enableAutomation(@Param('id') id: string) {
    return this.automationService.activeAutomation(id);
  }

  @Delete(':id')
  async deleteAutomation(@Param('id') id: string) {
    return this.automationService.deleteAutomation(id);
  }
}
