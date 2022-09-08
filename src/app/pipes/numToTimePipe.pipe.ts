import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numToTime' })
export class NumToTimePipe implements PipeTransform {
    transform(value: number): string {
        return new Date(value * 1000).toISOString().substr(11, 8);
    }
}