import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  animationFrameScheduler,
  auditTime,
  distinctUntilChanged,
  fromEvent,
  map,
  startWith,
  Subject,
  takeUntil,
  timer,
} from 'rxjs';
import { shuffledPositions } from './shuffles';

@Component({
  selector: 'app-shuffle-game',
  templateUrl: './shuffle-game.component.html',
  styleUrls: ['./shuffle-game.component.scss'],
})
export class ShuffleGameComponent implements OnInit, OnDestroy {
  pieces = [1, 2, 3, 4, 5, 6, 7, 8, 0];

  positions!: Array<Array<number>>;

  winnerPositions = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0],
  ];

  stringifiedWinnerPositions = this.winnerPositions.toString();

  gameIsWon = false;

  showResult = false;

  showSanta = false;

  @HostBinding('style.width')
  @HostBinding('style.height')
  width: string | null = null;

  widthOfPiece!: string;

  private readonly onDestroy$ = new Subject<void>();

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.setWidth$();
    this.positions =
      shuffledPositions[
        this.randomIntFromInterval(0, shuffledPositions.length - 1)
      ];
    //this.positions = this.winnerPositions;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onPieceClick(piece: number): void {
    if (piece === 0 || this.gameIsWon) {
      return;
    }

    const [rowIndex, columnIndex] = this.getPositionOfPiece(
      piece,
      this.positions
    );

    if (rowIndex !== 0 && this.positions[rowIndex - 1][columnIndex] === 0) {
      this.positions = [...this.positions.map((row) => [...row])];

      this.positions[rowIndex - 1][columnIndex] = piece;
      this.positions[rowIndex][columnIndex] = 0;
    } else if (
      rowIndex !== 2 &&
      this.positions[rowIndex + 1][columnIndex] === 0
    ) {
      this.positions = [...this.positions.map((row) => [...row])];

      this.positions[rowIndex + 1][columnIndex] = piece;
      this.positions[rowIndex][columnIndex] = 0;
    } else if (
      columnIndex !== 0 &&
      this.positions[rowIndex][columnIndex - 1] === 0
    ) {
      this.positions = [...this.positions.map((row) => [...row])];

      this.positions[rowIndex][columnIndex - 1] = piece;
      this.positions[rowIndex][columnIndex] = 0;
    } else if (
      columnIndex !== 2 &&
      this.positions[rowIndex][columnIndex + 1] === 0
    ) {
      this.positions = [...this.positions.map((row) => [...row])];

      this.positions[rowIndex][columnIndex + 1] = piece;
      this.positions[rowIndex][columnIndex] = 0;
    }

    if (this.positions.toString() === this.stringifiedWinnerPositions) {
      this.gameIsWon = true;
      this.onGameWon();
    }
  }

  public getTranslateForPiece = (
    piece: number,
    positions: Array<Array<number>>
  ) => {
    const [foundRowIndex, foundColumnIndex] = this.getPositionOfPiece(
      piece,
      positions
    );

    return `translate(${foundColumnIndex! * 100}%, ${foundRowIndex! * 100}%)`;
  };

  private setWidth$(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'resize').pipe(
        auditTime(0, animationFrameScheduler),
        startWith(null),
        map(() => {
          const width = Math.floor(window.innerWidth * 0.9);
          const height = Math.floor(window.innerHeight * 0.9);

          const min = Math.min(width, height);
          const minDividableWith3 = min - (min % 3);
          return minDividableWith3;
        }),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$)
      ).subscribe((width) => {
        this.ngZone.run(() => {
          this.widthOfPiece = `${width / 3}px`;
          this.width = `${width}px`;
          this.cdr.markForCheck();
        })
      });
    });
  }

  private onGameWon(): void {
    timer(500)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.showResult = true;
        this.cdr.markForCheck();
        timer(2000)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(() => {
            this.showSanta = true;
            this.cdr.markForCheck();
          });
      });
  }

  private getPositionOfPiece(
    piece: number,
    positions: Array<Array<number>>
  ): [number, number] {
    let foundRowIndex: number | undefined = undefined;
    let foundColumnIndex: number | undefined = undefined;

    for (
      let rowIndex = 0;
      rowIndex < positions.length &&
      foundRowIndex === undefined &&
      foundColumnIndex === undefined;
      rowIndex++
    ) {
      const row = positions[rowIndex];
      for (
        let columnIndex = 0;
        columnIndex < row.length &&
        foundRowIndex === undefined &&
        foundColumnIndex === undefined;
        columnIndex++
      ) {
        if (row[columnIndex] === piece) {
          foundRowIndex = rowIndex;
          foundColumnIndex = columnIndex;
        }
      }
    }

    return [foundRowIndex!, foundColumnIndex!];
  }

  private randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
