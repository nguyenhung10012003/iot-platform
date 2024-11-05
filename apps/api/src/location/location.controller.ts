import { AccessTokenGuard } from '@app/common/guards';
import { AuthenticatedRequest } from '@app/common/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
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
      setting: data.setting,
      areas: {
        create: {
          name: data.areaName || data.name,
        },
      },
    });
  }

  @Patch(':id')
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
  async updateLocation(
    @Req() req: AuthenticatedRequest,
    @Body() data: CreateLocationDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const imageUrl = await this.awsS3.uploadFile(image);
    return this.locationService.updateLocation(req.params.id, {
      name: data.name,
      address: data.address,
      image: imageUrl?.url,
      setting: data.setting,
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

  @Get('join')
  async getJoinLocations(@Req() req: AuthenticatedRequest) {
    return this.locationService.getJoinedLocations(req.user.userId);
  }

  @Post('user')
  async addUserToLocation(@Body() data: AddUserToLocationDto) {
    return this.locationService.addUserToLocation(data);
  }

  @Get('user')
  async getUserLocations(
    @Req() req: AuthenticatedRequest,
    @Query('locationId') locationId: string,
    @Query('role') role?: 'EMPLOYEE' | 'EMPLOYER',
  ) {
    return this.locationService.getUserLocations({
      where: {
        locationId: locationId,
        role: role,
      },
      select: {
        user: true,
        role: true,
      },
    });
  }

  @Delete('user')
  async removeUserFromLocation(@Body() data: RemoveUserFromLocationDto) {
    return this.locationService.removeUserFromLocation(data);
  }

  @Delete(':id')
  async deleteLocation(@Req() req: AuthenticatedRequest) {
    return this.locationService.deleteLocation({
      id: req.params.id,
    });
  }
}
