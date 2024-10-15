import { PutObjectCommandInput, S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsS3Service {
  private readonly s3: S3;
  constructor() {
    this.s3 = new S3({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },

      region: process.env.AWS_REGION || '',
    });
  }

  async uploadFile(file?: Express.Multer.File) {
    if (!file) {
      return;
    }
    const params: PutObjectCommandInput = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${Date.now()}-${file.originalname.length > 10 ? file.originalname.slice(0, 10) : file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const data = await new Upload({
      client: this.s3,
      params,
    }).done();
    return {
      url: data.Location as string,
    };
  }

  async uploadFiles(files: Express.Multer.File[]) {
    return Promise.all(
      files.map(async (file) => {
        return this.uploadFile(file);
      }),
    );
  }

  async deleteFile(fileUrl: string): Promise<void> {
    return;
  }
}
