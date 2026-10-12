import { Pipe, PipeTransform } from "@angular/core";
import { number } from "../../lib/engine";

@Pipe({ name: "bigvalue" })
export class BigvaluePipe implements PipeTransform {
  transform(value: number): string {
    return number(value);
  }
}
