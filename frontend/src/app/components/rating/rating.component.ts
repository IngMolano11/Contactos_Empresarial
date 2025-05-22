import { Component, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rating" [class.readonly]="readonly" [class.small]="size === 'small'">
      <div class="stars">
        <i *ngFor="let star of [1,2,3,4,5]"
           class="fas"
           [class.fa-star]="star <= rating"
           [class.fa-star-o]="star > rating"
           [style.cursor]="readonly ? 'default' : 'pointer'"
           (click)="!readonly && rate(star)"
           (mouseenter)="!readonly && hover(star)"
           (mouseleave)="!readonly && hover(0)">
        </i>
      </div>
    </div>
  `,
  styles: [`
    .rating {
      display: inline-block;
    }
    .stars {
      color: var(--color-purple-basil);
      display: flex;
      gap: 2px;
    }
    .stars i {
      transition: all var(--transition-normal);
    }
    .rating:not(.readonly) .stars i:hover {
      transform: scale(1.2);
    }
    .rating.small .stars i {
      font-size: 0.9rem;
    }
    .readonly .stars i {
      cursor: default;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingComponent),
      multi: true
    }
  ]
})
export class RatingComponent implements ControlValueAccessor {
  @Input() rating = 0;
  @Input() readonly = false;
  @Input() size: 'normal' | 'small' = 'normal';

  disabled = false;
  onChange = (value: number) => {};
  onTouched = () => {};

  writeValue(value: number): void {
    this.rating = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  rate(value: number): void {
    if (!this.disabled && !this.readonly) {
      this.rating = value;
      this.onChange(this.rating);
      this.onTouched();
    }
  }

  hover(value: number): void {
    if (!this.disabled && !this.readonly) {
      this.rating = value;
    }
  }
}