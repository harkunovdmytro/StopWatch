import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil, debounceTime, buffer, filter, map, BehaviorSubject, withLatestFrom, switchMap, timer } from "rxjs";

@Component({
	selector: 'app-stop-watch',
	templateUrl: './stop-watch.component.html',
	styleUrls: ['./stop-watch.component.scss'],
})
export class StopWatchComponent implements OnInit {
	time$ = new BehaviorSubject<number>(0);

	onStart$ = new BehaviorSubject<boolean>(false);
	onStop$ = new Subject();
	waitTrigger$ = new BehaviorSubject(false);

	ngOnInit(): void {
		const clickStream = this.waitTrigger$.asObservable();

		clickStream.pipe(
			buffer(clickStream.pipe(debounceTime(300))),
			map(list => list.length),
			filter((x) => x >= 2),
		).subscribe((): void => {
			this.onStop$.next('');
			this.onStart$.next(false);
		});
	}

	waitTimer(): void {
		this.waitTrigger$.next(false);
	}
	
	startTimer(): void {
		this.onStart$.next(true);

		this.onStart$.pipe(
			switchMap(() => timer(0,1000)),
			withLatestFrom(this.time$),
			takeUntil(this.onStop$),
			map(([_, v]) => v),
		).subscribe((v) => {
			console.log(v);
			this.time$.next(v + 1);
		});
	}

	stopTimer(): void {
		this.onStop$.next(true);
		this.onStop$ = new Subject();
		this.onStart$.next(false);

		this.time$.next(0);
	}

	resetTimer() {
		this.stopTimer();
		this.startTimer();
	}
}