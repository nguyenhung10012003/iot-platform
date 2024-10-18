import { AccessTokenGuard } from '@app/common/guards';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewayCreateDto } from './types/gateway-create.dto';
import { AuthenticatedRequest } from '@app/common/types';

@Controller('gateway')
@UseGuards(AccessTokenGuard)
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post()
  async connectGateway(@Body() data: GatewayCreateDto) {
    return this.gatewayService.createGateway(data);
  }

  @Get()
  async getGateways(@Req() req: AuthenticatedRequest) {
    return this.gatewayService.getGatewaysForUser(req.user.userId);
  }
}
