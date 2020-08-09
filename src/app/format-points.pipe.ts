import { Pipe, PipeTransform } from '@angular/core';
import {formatPoints} from './utils';

@Pipe({
  name: 'formatPoints'
})
export class FormatPointsPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    return formatPoints(value);
  }

}
