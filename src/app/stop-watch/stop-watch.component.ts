import { Component, OnInit } from '@angular/core';
import { timer, Subject, takeUntil, debounceTime, buffer, filter, map, Observable } from "rxjs";

@Component({
  selector: 'app-stop-watch',
  templateUrl: './stop-watch.component.html',
  styleUrls: ['./stop-watch.component.scss'],
})
export class StopWatchComponent implements OnInit {
  time = 0;

  isStarted = false;
  isPaused = false;

  private observer$ = new Subject();
  private rxjsTimer$ = timer(0, 1000);

  private delay: number = 0;
  private waitTrigger = new Subject();

  ngOnInit(): void {
    const clickStream = this.waitTrigger.asObservable();
    const clickDelay = 300;

    clickStream.pipe(
      buffer(clickStream.pipe(debounceTime(clickDelay))),
      map(list => list.length),
      filter((x) => x >= 2),
    ).subscribe((): void => {
      this.delay = this.time;
      this.stopIteartion();
      this.isPaused = true;
    });
  }

  onDestroy() {
    this.stopIteartion();
  }

  waitTimer(): void {
    this.waitTrigger.next('');
  }

  startTimer(): void {
    this.isStarted = true;
    this.isPaused = false;

    this.rxjsTimer$.pipe(
      takeUntil(this.observer$),
    ).subscribe((counter) => {
      this.time = counter + this.delay;
    })
  }
  stopTimer(): void {
    this.isStarted = false;
    this.isPaused = false;

    this.stopIteartion();
    this.time = 0;
    this.delay = 0;
  }

  resetTimer() {
    this.stopTimer();
    this.startTimer();
  }

  private stopIteartion(): void {
    this.observer$.next(null);
    this.observer$.complete();
    this.observer$ = new Subject();
  }
}