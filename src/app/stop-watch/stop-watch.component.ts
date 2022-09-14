import { Component, OnInit } from '@angular/core';
import { timer, Subject, takeUntil, debounceTime, buffer, filter, map, Observable } from "rxjs";

@Component({
  selector: 'app-stop-watch',
  templateUrl: './stop-watch.component.html',
  styleUrls: ['./stop-watch.component.scss'],
})
export class StopWatchComponent implements OnInit {
  showingTime = this.convertNumberToDateString(0);

  isStarted = false;
  isPaused = false;

  private time = 0;
  private delay: number = 0;

  private observer$ = new Subject();
  private waitTrigger$ = new Subject();

  ngOnInit(): void {
    const clickStream = this.waitTrigger$.asObservable();

    clickStream.pipe(
      buffer(clickStream.pipe(debounceTime(300))),
      map(list => list.length),
      filter((x) => x >= 2),
    ).subscribe((): void => {
      this.delay = this.time;
      this.isPaused = true;
      this.stopIteartion();
    });
  }

  onDestroy() {
    this.stopIteartion();
  }

  waitTimer(): void {
    this.waitTrigger$.next('');
  }

  startTimer(): void {
    this.isStarted = true;
    this.isPaused = false;

    timer(0, 1000).pipe(
      takeUntil(this.observer$),
    ).subscribe((counter) => {
      this.time = counter + this.delay;
      this.showCurrentTime();
    })
  }
  
  stopTimer(): void {
    this.isStarted = false;
    this.isPaused = false;

    this.time = 0;
    this.delay = 0;
    this.stopIteartion();
    this.showCurrentTime();
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

  private convertNumberToDateString(value: number) {
    return String(new Date(value).setHours(0, 0, value));
  }

  private showCurrentTime(){
    this.showingTime = this.convertNumberToDateString(this.time);
  }
}