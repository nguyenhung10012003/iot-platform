import { AccessTokenGuard } from '@app/common/guards';
import { AuthenticatedRequest } from '@app/common/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewayCreateDto } from './types/gateway-create.dto';

@Controller('gateway')
@UseGuards(AccessTokenGuard)
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post()
  async connectGateway(@Body() data: GatewayCreateDto) {
    return this.gatewayService.createGateway(data);
  }

  @Get()
  async getGateways(
    @Req() req: AuthenticatedRequest,
    @Query('locationId') locationId?: string,
  ) {
    return this.gatewayService.getGatewaysForUser({
      userId: req.user.userId,
      locationId,
    });
  }

  @Delete(':id')
  async deleteGateway(@Param('id') id: string) {
    return this.gatewayService.deleteGateway(id);
  }
}
