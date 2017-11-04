import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'filter'})
export class ItemLocationFilter implements PipeTransform {
  transform(items: any[], field : string, value : string): any[] {
    var array = [];
      if (!items) return [];
      items.filter(it => {
        if(it.upc == value){
          array.push(it)
        }
      });
  }
}
