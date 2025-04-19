import { HasAnyRole } from '@app/common/decorators/has-role.decorator';
import { AccessTokenGuard } from '@app/common/guards';
import { AuthenticatedRequest } from '@app/common/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { DeviceTemplateService } from './device-template.service';
import { CreateDeviceTemplateDto } from './types/create-device-teamplate.dto';
import { GetDeviceTemplateQuery } from './types/get-device-template.query';
import { UpdateDeviceTemplateDto } from './types/update-device-template.dto';

@Controller('device-template')
@UseGuards(AccessTokenGuard)
export class DeviceTemplateController {
  constructor(
    private readonly deviceTemplateService: DeviceTemplateService,
    private readonly aws3: AwsS3Service,
  ) {}

  @Post()
  @HasAnyRole('ADMIN')
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
  async createDeviceTemplate(
    @Body() data: CreateDeviceTemplateDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const imageUrl = await this.aws3.uploadFile(image);
    return this.deviceTemplateService.createDeviceTemplate({
      ...data,
      image: imageUrl?.url,
    });
  }

  @Patch(':id')
  @HasAnyRole('ADMIN')
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
  async updateDeviceTemplate(
    @Param('id') id: string,
    @Body() data: UpdateDeviceTemplateDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const imageUrl = await this.aws3.uploadFile(image);
    return this.deviceTemplateService.updateDeviceTemplate(id, {
      ...data,
      image: imageUrl?.url,
    });
  }

  @Get()
  async getDeviceTemplates(
    @Query() query: GetDeviceTemplateQuery,
    @Req() req: AuthenticatedRequest,
  ) {
    const user = req.user;
    return this.deviceTemplateService.getDeviceTemplates({
      where: {
        model: {
          contains: query.q,
        },
        deviceType: {
          in: query.deviceType,
        },
        userIds:
          user.role === 'ADMIN'
            ? undefined
            : {
                has: user.userId,
              },
      },
      include:
        user.role === 'ADMIN'
          ? {
              users: true,
            }
          : undefined,
    });
  }

  @Delete(':id')
  @HasAnyRole('ADMIN')
  async deleteDeviceTemplate(@Param('id') id: string) {
    return this.deviceTemplateService.deleteDeviceTemplate(id);
  }
}
