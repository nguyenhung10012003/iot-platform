import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { PetsPredictController } from "./pets-predict.controller";
import { PetsPredictService } from "./pets-predict.service";
import { AwsS3Service } from "src/s3/aws-s3.service";

@Module({
  imports: [],
  controllers: [PetsPredictController],
  providers: [PrismaService, PetsPredictService, AwsS3Service],
})
export class PetsPredictModule {}