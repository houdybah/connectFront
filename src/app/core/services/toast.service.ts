import { Injectable } from '@angular/core';

export interface Toast {
  message: string;
  classname?: string;
  delay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: Toast[] = [];

  show(toast: Toast) {
    this.toasts.push(toast);
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  success(message: string, delay: number = 3000) {
    this.show({
      message,
      classname: 'bg-success text-white',
      delay
    });
  }

  error(message: string, delay: number = 5000) {
    this.show({
      message,
      classname: 'bg-danger text-white',
      delay
    });
  }

  warning(message: string, delay: number = 3000) {
    this.show({
      message,
      classname: 'bg-warning text-white',
      delay
    });
  }

  info(message: string, delay: number = 3000) {
    this.show({
      message,
      classname: 'bg-info text-white',
      delay
    });
  }

  clear() {
    this.toasts = [];
  }
}



