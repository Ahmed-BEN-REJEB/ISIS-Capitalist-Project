import { Pipe, PipeTransform } from "@angular/core";
import { duration } from "../../lib/engine";

@Pipe({ name: "second" })
export class SecondPipe implements PipeTransform {
  transform(value: number): string {
    return duration(value);
  }
}
