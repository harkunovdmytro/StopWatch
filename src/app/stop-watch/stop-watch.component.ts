import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil, debounceTime, buffer, filter, map, BehaviorSubject, withLatestFrom, switchMap, timer, take, skip } from "rxjs";

@Component({
    selector: 'app-stop-watch',
    templateUrl: './stop-watch.component.html',
    styleUrls: ['./stop-watch.component.scss'],
})
export class StopWatchComponent implements OnInit {
    time$ = new BehaviorSubject<number>(0);

    onStart$ = new BehaviorSubject<boolean>(false);
    waitTrigger$ = new Subject<void>();

    ngOnInit(): void {
        const clickStream = this.waitTrigger$.asObservable();

        clickStream.pipe(
            buffer(clickStream.pipe(debounceTime(300))),
            map(list => list.length),
            filter((clicksQuantity) => clicksQuantity >= 2),
        ).subscribe((): void => {
            this.onStart$.next(false);
        });

        this.onStart$.pipe(
            filter((onStartCurrentValue) => onStartCurrentValue),
            switchMap(
                () => timer(0, 1000)
                    .pipe(
                        takeUntil(this.onStart$.pipe(filter((onStartCurrentValue) => !onStartCurrentValue)),),
                        withLatestFrom(this.time$),
                        map(([_, time]): number => time + 1)),
            ))
            .subscribe((currentStopwatchTime) => {
                this.time$.next(currentStopwatchTime);
            })
    }

    waitTimer(): void {
        this.waitTrigger$.next();
    }

    startTimer(): void {
        this.onStart$.next(true);
    }

    stopTimer(): void {
        this.onStart$.next(false);
        this.time$.next(0);
    }

    resetTimer(): void {
        this.stopTimer();
        this.startTimer();
    }
}