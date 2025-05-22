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
           [class.fa-star]="star <= value"
           [class.fa-star-o]="star > value"
           [style.cursor]="readonly ? 'default' : 'pointer'"
           (click)="!readonly && onRate(star)"
           (mouseenter)="!readonly && onHover(star)"
           (mouseleave)="!readonly && onHover(value)">
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
      font-size: 1.2rem;
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
  @Input() readonly = false;
  @Input() size: 'normal' | 'small' = 'normal';
  @Input() set rating(val: number) {
    this.value = val;
    this.onChange(this.value);
  }
  get rating(): number {
    return this.value;
  }

  value = 0;
  disabled = false;
  onChange = (value: number) => {};
  onTouched = () => {};

  writeValue(value: number): void {
    this.value = value || 0;
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

  onRate(value: number): void {
    if (!this.disabled && !this.readonly) {
      this.value = value;
      this.onChange(this.value);
      this.onTouched();
    }
  }

  onHover(value: number): void {
    if (!this.disabled && !this.readonly) {
      this.value = value;
    }
  }
}