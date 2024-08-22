import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatIdentifier',
})
export class FormatIdentifierPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    const replacedString = value.replace(/_/g, ' ');
    return replacedString;
  }
}
