import { PrismaService } from "src/prisma.service";

export class PredictService {
  constructor(private readonly prisma: PrismaService) {}

  async predict(data: {
    temperature: number;
    humidity: number;
    wind: number;
    soilMoisture: number;
    rainfall: number;
  }) {
    
  }
}