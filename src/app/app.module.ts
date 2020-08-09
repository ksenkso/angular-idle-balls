import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PlaygroundComponent } from './playground/playground.component';
import { ControlsComponent } from './controls/controls.component';
import { ShopComponent } from './shop/shop.component';
import { FormatPointsPipe } from './format-points.pipe';

@NgModule({
  declarations: [
    AppComponent,
    PlaygroundComponent,
    ControlsComponent,
    ShopComponent,
    FormatPointsPipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
