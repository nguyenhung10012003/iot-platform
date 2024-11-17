import cronParser from 'cron-parser';
import { DateTime } from 'luxon';

type ParsedCron = {
  hour: number;
  minute: number;
  days: number[]; // Trả về danh sách số
};

export function convertCronToUTC(
  cronExpression: string,
  timeZone: string,
): string {
  // console.log(cronExpression, timeZone);
  try {
    // Lấy thời điểm hiện tại trong múi giờ đã cho
    const now = DateTime.now().setZone(timeZone);

    // Phân tích cron để lấy thời điểm đầu tiên từ bây giờ
    const interval = cronParser.parseExpression(cronExpression, {
      currentDate: now.toJSDate(), // Chuyển đổi Luxon DateTime sang Date
    });
    const nextDate = DateTime.fromJSDate(interval.next().toDate(), {
      zone: timeZone,
    });

    // Chuyển đổi thời điểm đầu tiên sang UTC
    const nextUTCDate = nextDate.setZone('utc');
    // console.log(nextUTCDate, nextDate, timeZone);

    // Tạo cron expression mới theo UTC
    const utcCronExpression = `${nextUTCDate.minute} ${nextUTCDate.hour} * * *`;

    return utcCronExpression;
  } catch (error) {
    throw new Error('Invalid cron expression or timezone');
  }
}

export function parseCron(cronString: string): ParsedCron {
  const parts = cronString.split(' ');

  if (parts.length !== 5) {
    throw new Error(
      'Invalid cron string. Must have 5 parts: [minute hour dayOfMonth month dayOfWeek].',
    );
  }

  const [minute, hour, , , dayOfWeek] = parts;

  // Xử lý hour
  const parsedHour = hour === '*' ? 12 : parseInt(hour || '12', 10);

  if (isNaN(parsedHour) || parsedHour < 0 || parsedHour > 23) {
    throw new Error(`Invalid hour: ${hour}`);
  }

  // Xử lý minute
  const parsedMinute = minute === '*' ? 0 : parseInt(minute || '0', 10);

  if (isNaN(parsedMinute) || parsedMinute < 0 || parsedMinute > 59) {
    throw new Error(`Invalid minute: ${minute}`);
  }

  // Xử lý ngày trong tuần
  const days =
    dayOfWeek === '*'
      ? [0, 1, 2, 3, 4, 5, 6] // Tất cả các ngày trong tuần
      : dayOfWeek?.split(',').map((day) => {
          const parsedDay = parseInt(day, 10);
          if (isNaN(parsedDay) || parsedDay < 0 || parsedDay > 6) {
            throw new Error(`Invalid day of the week: ${day}`);
          }
          return parsedDay;
        });

  return {
    hour: parsedHour,
    minute: parsedMinute,
    days: days || [0, 1, 2, 3, 4, 5, 6],
  };
}

export function toCronString(
  hour: number,
  minute: number,
  days: number[],
): string {
  // Kiểm tra giá trị của hour
  if (hour < 0 || hour > 23) {
    throw new Error('Invalid hour. Must be between 0 and 23.');
  }

  // Kiểm tra giá trị của minute
  if (minute < 0 || minute > 59) {
    throw new Error('Invalid minute. Must be between 0 and 59.');
  }

  // Kiểm tra giá trị của days
  const validDays = days.every((day) => day >= 0 && day <= 6);
  if (!validDays) {
    throw new Error(
      'Invalid days. Each day must be between 0 (Sunday) and 6 (Saturday).',
    );
  }

  // Xử lý chuỗi days
  const daysPart =
    days.length === 7 || days.length === 0 ? '*' : days.sort((a, b) => a - b).join(',');

  // Tạo chuỗi cron
  const cronString = `${minute} ${hour} * * ${daysPart}`;

  return convertCronToUTC(cronString, getUserTimeZone());
}

function getUserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
