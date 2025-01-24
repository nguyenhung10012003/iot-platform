import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

export class PredictService {
  constructor(private readonly prisma: PrismaService) {}

  async predict(data: {
    temperature?: number;
    humidity?: number;
    wind?: number;
    soilMoisture?: number;
    rainfall?: number;
  }): Promise<{ prediction: number } | null> {
    try {
      if (
        data.temperature === undefined ||
        data.humidity === undefined ||
        data.wind === undefined ||
        data.soilMoisture === undefined ||
        data.rainfall === undefined
      ) {
        return null;
      }
      const result = await fetch(`${process.env.PREDICT_API_URL}/predict`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // console.log(result);
      Logger.debug(
        'Predict result: ' + JSON.stringify(result),
        PredictService.name,
      );

      const predict = await result.json();
      return { prediction: Number(predict.prediction) };
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
