import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PetsPredictService {
  constructor(private readonly prisma: PrismaService) {}

  async createPetsPredict(
    data:
      | Prisma.PetsPredictCreateInput
      | Prisma.PetsPredictUncheckedCreateInput,
  ) {
    return this.prisma.petsPredict.create({
      data,
    });
  }

  async getPetsPredict(locationId: string) {
    return this.prisma.petsPredict.findMany({
      where: {
        locationId,
      },
    });
  }

  async getPetPredict(id: string) {
    return this.prisma.petsPredict.findUnique({
      where: {
        id,
      },
    });
  }

  async predict(image: Blob, fileName: string) {
    const formData = new FormData();
    formData.append('image', image, fileName);
    const result = await fetch(`${process.env.PREDICT_API_URL}/detect`, {
      method: 'POST',
      body: formData,
      // headers: {
      //   'Content-Type': 'multipart/form-data',
      // }
    });
    const predict = await result.json();
    return predict?.name || "";
  }
}
