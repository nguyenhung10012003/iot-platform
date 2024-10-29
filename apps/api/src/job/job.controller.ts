import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from 'src/s3/aws-s3.service';
import { JobService } from './job.service';
import { CreateJobDto } from './types/create-job.dto';
import { UpdateJobDto } from './types/update-job.dto';

@Controller('job')
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private readonly s3: AwsS3Service,
  ) {}

  @Post()
  async createJob(@Body() createJobDto: CreateJobDto) {
    return this.jobService.createJob(createJobDto);
  }

  @Get()
  async getJobs(@Query() query: { locationId?: string; asigneeId?: string }) {
    return this.jobService.getJobs(query);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
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
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const report = await this.s3.uploadFile(file);
    return this.jobService.updateJob(id, {
      ...updateJobDto,
      report: report?.url,
    });
  }

  @Delete(':id')
  async deleteJob(@Param('id') id: string) {
    return this.jobService.deleteJob(id);
  }
}
