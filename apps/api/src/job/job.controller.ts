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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from 'src/s3/aws-s3.service';
import { JobService } from './job.service';
import { CreateJobDto } from './types/create-job.dto';
import { UpdateJobDto } from './types/update-job.dto';

@UseGuards(AccessTokenGuard)
@Controller('job')
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private readonly s3: AwsS3Service,
  ) {}

  @Post()
  async createJob(
    @Body() createJobDto: CreateJobDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.jobService.createJob(createJobDto, req.user.userId);
  }

  @Get()
  async getJobs(@Query() query: { locationId?: string; asigneeId?: string }) {
    return this.jobService.getJobs(query);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('files', 100, {
      fileFilter: (req, file, cb) => {
        if (!file) {
          return cb(null, true);
        }

        if (
          !file.mimetype.match(
            /\/(pdf|doc|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/,
          )
        ) {
          return cb(new Error('Only PDF and DOC files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async updateJob(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @Req() req: AuthenticatedRequest,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const newReports = await Promise.all(
      files?.map(async (file) => ({
        url: (await this.s3.uploadFile(file)).url,
        name: file.originalname,
      })) || [],
    );
    const existingReports = updateJobDto.reports || [];

    return this.jobService.updateJob(
      id,
      {
        ...updateJobDto,
        reports: [...existingReports, ...newReports],
      },
      req.user.userId,
    );
  }

  @Delete(':id')
  async deleteJob(@Param('id') id: string) {
    return this.jobService.deleteJob(id);
  }
}
