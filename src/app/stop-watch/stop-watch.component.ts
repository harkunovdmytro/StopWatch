import { Component } from '@angular/core';
import { interval, Subject, takeUntil } from "rxjs";

@Component({
  selector: 'app-stop-watch',
  templateUrl: './stop-watch.component.html',
  styleUrls: ['./stop-watch.component.scss']
})
export class StopWatchComponent {
  time: number = 0;
  observer = new Subject();
  rxjsTimer = interval(1000);
  isPaused: boolean = false;
  delay: number = 0;
  subscription: any;
  isDoubleClick: boolean = false;

  startTimer() {
    this.subscription = this.rxjsTimer.pipe(takeUntil(this.observer))
      .subscribe(
        (counter) => {
          this.time = counter + this.delay;
          console.log("time: " + this.time)
          console.log("counter: " + counter)
        })
  }
  stopTimer() {
    this.stopIteartion()
    this.time = 0;
    this.delay = 0;

  }
  waitTimer() {
    if (this.isDoubleClick) {
      this.delay = this.time;
      this.stopIteartion();
      this.isDoubleClick = false;
    }
    this.isDoubleClick = true;
    setTimeout(() => {
      this.isDoubleClick = false;
    }, 300);
  }

  stopIteartion() {
    this.observer.next('');
    this.observer.complete();
    this.observer = new Subject();
  }
}


// Create a Stopwatch that counts time in HH:MM:SS format.

// Stopwatch should have following buttons:
// Start/Stop
// Wait (works on doubleclick, time between clicks should be 300ms or smaller)
// Reset

// (!) 300 ms - it’s not a doubleclick event

// To pass this task, please use:
// Angular Material (design is up to you)
// Observables
// RxJS



//