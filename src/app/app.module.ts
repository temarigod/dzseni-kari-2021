import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ShuffleGameComponent } from './component/shuffle-game/shuffle-game.component';
import { MethodInvokerPipe } from './pipes/method-invoker.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ShuffleGameComponent,
    MethodInvokerPipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
