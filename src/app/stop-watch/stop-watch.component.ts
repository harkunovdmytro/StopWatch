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
	waitTrigger$ = new Subject();

	ngOnInit(): void {
		const clickStream = this.waitTrigger$.asObservable();

		clickStream.pipe(
			buffer(clickStream.pipe(debounceTime(300))),
			map(list => list.length),
			filter((x) => x >= 2),
		).subscribe((): void => {
			this.onStart$.next(false);
		});

		this.onStart$.pipe(
			filter(() => this.onStart$.value),
			switchMap(
				() => timer(0, 1000)
					.pipe(
						withLatestFrom(this.time$),
						takeUntil(this.onStart$.pipe(skip(1))),
						map(([_, time]): number => time))
			))
			.subscribe((time) => {
				this.time$.next(time + 1);
			})
	}

	waitTimer(): void {
		this.waitTrigger$.next(null);
	}

	startTimer(): void {
		this.onStart$.next(true);
	}

	stopTimer(): void {
		this.onStart$.next(false);
		this.time$.next(0);
	}

	resetTimer() {
		this.stopTimer();
		this.startTimer();
	}
}