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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from 'src/s3/aws-s3.service';
import { LocationService } from './location.service';
import { AddUserToLocationDto } from './types/add-user-location.dto';
import { CreateLocationDto } from './types/create-location.dto';
import { LocationQuery } from './types/location.query';
import { RemoveUserFromLocationDto } from './types/remove-user-location.dto';

@Controller('location')
@UseGuards(AccessTokenGuard)
export class LocationController {
  constructor(
    private readonly locationService: LocationService,
    private readonly awsS3: AwsS3Service,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, cb) => {
        if (!file) {
          return cb(null, true);
        }
        if (!file.mimetype.match(/image/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async createLocation(
    @Req() req: AuthenticatedRequest,
    @Body() data: CreateLocationDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const imageUrl = await this.awsS3.uploadFile(image);
    return this.locationService.createLocation({
      name: data.name,
      address: data.address,
      ownerId: req.user.userId,
      image: imageUrl?.url,
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

  @Post('user')
  async addUserToLocation(@Body() data: AddUserToLocationDto) {
    return this.locationService.addUserToLocation({
      role: data.role,
      locationId: data.locationId,
      username: data.username,
    });
  }

  @Get('user')
  async getUserLocations(
    @Req() req: AuthenticatedRequest,
    @Query('locationId') locationId: string,
  ) {
    return this.locationService.getUserLocations({
      where: {
        locationId: locationId,
      },
      select: {
        user: true,
        role: true,
      },
    });
  }

  @Delete('user')
  async removeUserFromLocation(@Body() query: RemoveUserFromLocationDto) {
    return this.locationService.removeUserFromLocation({
      userId_locationId: {
        locationId: query.locationId,
        userId: query.userId,
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
