import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  input,
  output,
  viewChild,
} from "@angular/core";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal implements AfterViewInit, OnDestroy {
  readonly title = input.required<string>();
  readonly closed = output<void>();
  private readonly dialog =
    viewChild.required<ElementRef<HTMLDialogElement>>("dialog");
  private previous: HTMLElement | null = null;
  ngAfterViewInit() {
    this.previous = document.activeElement as HTMLElement | null;
    this.dialog().nativeElement.showModal();
  }
  ngOnDestroy() {
    this.dialog().nativeElement.close();
    this.previous?.focus();
  }
  cancel(event: Event) {
    event.preventDefault();
    this.closed.emit();
  }
  backdrop(event: MouseEvent) {
    if (event.target === this.dialog().nativeElement) this.closed.emit();
  }
}
