import { Component, OnInit } from '@angular/core';
import { interval, Subject, takeUntil, debounceTime, buffer, filter, map } from "rxjs";

@Component({
  selector: 'app-stop-watch',
  templateUrl: './stop-watch.component.html',
  styleUrls: ['./stop-watch.component.scss']
})
export class StopWatchComponent implements OnInit {
  time: number = 0;

  private observer = new Subject();
  private rxjsTimer = interval(1000);

  private delay: number = 0;
  private subscription: any;
  private isDoubleClick: boolean = false;

  obs = new Subject();

  startTimer() {
    this.subscription = this.rxjsTimer.pipe(takeUntil(this.observer))
      .subscribe(
        (counter) => {
          this.time = counter + this.delay;
        })
  }
  stopTimer() {
    this.stopIteartion()
    this.time = 0;
    this.delay = 0;

  }

  stopIteartion() {
    this.observer.next('');
    this.observer.complete();
    this.observer = new Subject();
  }

  public ngOnInit() {
    const clickStream = this.obs.asObservable();
    const dly = 300;

    const multiClickStream = clickStream.pipe(
      buffer(clickStream.pipe(debounceTime(dly))),
      map(list => list.length),
      filter((x) => x >= 2)
    );

    multiClickStream.subscribe(
      () => {
        this.delay = this.time;
        this.stopIteartion();
      }
    )
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