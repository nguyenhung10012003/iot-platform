import { AccessTokenGuard } from '@app/common/guards';
import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from 'src/s3/aws-s3.service';
import { PetsPredictService } from './pets-predict.service';

@Controller('pets-predict')
@UseGuards(AccessTokenGuard)
export class PetsPredictController {
  constructor(
    private readonly petPredictService: PetsPredictService,
    private readonly aws3: AwsS3Service,
  ) {}

  @Get()
  getPetsPredict(@Query('locationId') locationId: string) {
    if (!locationId) {
      throw new Error('LocationId is required');
    }
    return this.petPredictService.getPetsPredict(locationId);
  }

  @Get(':id')
  getPetPredict(@Param('id') id: string) {
    return this.petPredictService.getPetPredict(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (_req, file, cb) => {
        if (!file) {
          return cb(new Error('No file uploaded'), false);
        }
        if (!file.mimetype.match(/image/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async createPetsPredict(
    @UploadedFile() image: Express.Multer.File,
    @Query('locationId') locationId?: string,
  ) {
    if (!locationId) {
      throw new Error('LocationId is required');
    }
    const imageUrl = await this.aws3.uploadFile(image);
    const imageBlob = new Blob([image.buffer], { type: image.mimetype });
    const result = await this.petPredictService.predict(imageBlob, image.filename);
    // const result = "Healthy";
    return this.petPredictService.createPetsPredict({
      image: imageUrl?.url,
      result,
      locationId,
    });
  }
}
