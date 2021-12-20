import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'DzseniKari2021';

  constructor(private readonly ngZone: NgZone) {}

  ngOnInit(): void {
    this.animateSnowFlakes();
  }

  private animateSnowFlakes() {
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.createSnowFlake();
      }, 50);
    });
  }

  private createSnowFlake() {
    const snow_flake = document.createElement('span');
    snow_flake.classList.add('icon-snowflake');
    snow_flake.style.left = Math.random() * window.innerWidth + 'px';
    snow_flake.style.animationDuration = Math.random() * 3 + 2 + 's'; // between 2 - 5 seconds
    snow_flake.style.opacity = Math.random().toString();
    snow_flake.style.fontSize = Math.random() * 10 + 10 + 'px';

    document.body.appendChild(snow_flake);

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        snow_flake.remove();
      }, 5000);
    });
  }
}
