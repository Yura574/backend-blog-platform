import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class NumberPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): number {
    const num = Number(value);
    if (isNaN(num)) throw new BadRequestException('Not a number');
    return num;
  }
}
