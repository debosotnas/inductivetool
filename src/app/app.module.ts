import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TextPortionComponent } from './text-portion/text-portion.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TextSelectionDirective } from './text-selection/text-selection.directive';
import { TextTooltipComponent } from './text-tooltip/text-tooltip.component';

@NgModule({
  declarations: [
    AppComponent,
    TextPortionComponent,
    TextSelectionDirective,
    TextTooltipComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
