import { Component, OnInit } from '@angular/core';
import { timer, Subject, takeUntil, debounceTime, buffer, filter, map, Observable } from "rxjs";

@Component({
  selector: 'app-stop-watch',
  templateUrl: './stop-watch.component.html',
  styleUrls: ['./stop-watch.component.scss']
})
export class StopWatchComponent implements OnInit {
  time = 0;
  dat = new Date();

  isStarted = false;
  isPaused = false;

  private observer = new Subject();
  private rxjsTimer$ = timer(0, 1000);

  private delay: number = 0;
  private subscription$!: Observable<number>;
  private waitTrigger = new Subject();

  ngOnInit(): void {
    this.dat.setHours(0, 0, 0, 0);
    const clickStream = this.waitTrigger.asObservable();
    const clickDelay = 300;

    clickStream.pipe(
      buffer(clickStream.pipe(debounceTime(clickDelay))),
      map(list => list.length),
      filter((x) => x >= 2)
    ).subscribe(
      (): void => {
        this.delay = this.time;
        this.stopIteartion();
        this.setTime(this.delay)
        this.isPaused = true;
      }
    )
  }

  waitTimer(): void {
    this.waitTrigger.next('');
  }

  startTimer(): void {
    this.isStarted = true;
    this.isPaused = false;

    this.subscription$ = this.rxjsTimer$.pipe(takeUntil(this.observer))
    this.subscription$.subscribe(
      (counter) => {
        this.time = counter + this.delay;
        this.setTime(this.time)
      })
  }
  stopTimer(): void {
    this.isStarted = false;
    this.isPaused = false;

    this.stopIteartion()
    this.time = 0;
    this.delay = 0;
    this.dat.setHours(0, 0, 0, 0);
  }

  private stopIteartion(): void {
    this.observer.next('');
    this.observer.complete();
    this.observer = new Subject();
    this.setTime()

  }
  private setTime(time: number = 0) {
    this.dat = new Date()
    this.dat.setHours(0, 0, time);
  }

}