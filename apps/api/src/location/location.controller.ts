import { AccessTokenGuard } from '@app/common/guards';
import { AuthenticatedRequest } from '@app/common/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './types/create-location.dto';
import { LocationQuery } from './types/location.query';

@Controller('location')
@UseGuards(AccessTokenGuard)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  async createLocation(
    @Req() req: AuthenticatedRequest,
    @Body() data: CreateLocationDto,
  ) {
    return this.locationService.createLocation({
      name: data.name,
      address: data.address,
      ownerId: req.user.userId,
      areas: {
        create: {
          name: data.areaName || data.name,
        },
      },
    });
  }

  @Get()
  async getLocations(
    @Req() req: AuthenticatedRequest,
    @Query() query: LocationQuery,
  ) {
    return this.locationService.getLocations({
      where: {
        ownerId: req.user.userId,
      },
      include: {
        areas: query.includeArea,
      },
    });
  }

  @Delete(':id')
  async deleteLocation(@Req() req: AuthenticatedRequest) {
    return this.locationService.deleteLocation({
      ownerId: req.user.userId,
      id: req.params.id,
    });
  }
}
