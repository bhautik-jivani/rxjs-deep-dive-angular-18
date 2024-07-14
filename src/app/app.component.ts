import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{
  clickCount = signal(0)
  clickCount$ = toObservable(this.clickCount)

  interval$ = interval(1000)
  intervalSignal = toSignal(this.interval$, {initialValue: 0})

  customInterval$ = new Observable((subscriber) => {
    let timesExecuted = 0
    const interval = setInterval(() => {
      if (timesExecuted > 3) {
        clearInterval(interval)
        subscriber.complete()
        return
      }
      console.log("Emitted new value...");
      subscriber.next({message: 'New Value'})
      timesExecuted++
    }, 1000)
  })

  private destroyRef = inject(DestroyRef)

  ngOnInit(): void {
    const subscription = this.clickCount$.subscribe({
      next: (val) => console.log(`Clicked button ${this.clickCount()} times.`),
    })

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe()
    })

    this.customInterval$.subscribe({
      next: (val) => console.log(val),
      complete: () => console.log('COMPLETED!'),
      error: (err) => console.log(err)

    })
  }

  onClick() {
    this.clickCount.update((prevCount) => prevCount + 1)
  }
}
