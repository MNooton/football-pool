import { Directive, output, HostListener } from '@angular/core';

@Directive({
  selector: '[appSwipe]',
  standalone: false
})
export class SwipeDirective {
  // Outputs using Angular's output() API
  swipeLeft = output<void>();
  swipeRight = output<void>();

  private touchStartX = 0;
  private touchStartY = 0;
  private minSwipeDistance = 50; // threshold in pixels

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const deltaX = touchEndX - this.touchStartX;
    const deltaY = touchEndY - this.touchStartY;

    // Ensure the motion was mostly horizontal (prevents triggering on vertical scrolling)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.minSwipeDistance) {
      if (deltaX < 0) {
        this.swipeLeft.emit();  // Swiped left -> Go Next
      } else {
        this.swipeRight.emit(); // Swiped right -> Go Previous
      }
    }
  }
}