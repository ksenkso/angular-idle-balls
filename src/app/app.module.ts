import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PlaygroundComponent } from './playground/playground.component';
import { ControlsComponent } from './controls/controls.component';
import { ShopComponent } from './shop/shop.component';
import { FormatPointsPipe } from './format-points.pipe';
import { ProgressComponent } from './progress/progress.component';

@NgModule({
  declarations: [
    AppComponent,
    PlaygroundComponent,
    ControlsComponent,
    ShopComponent,
    FormatPointsPipe,
    ProgressComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
