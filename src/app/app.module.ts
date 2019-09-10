import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TextPortionComponent } from './text-portion/text-portion.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TextSelectionDirective } from './text-selection/text-selection.directive';

@NgModule({
  declarations: [
    AppComponent,
    TextPortionComponent,
    TextSelectionDirective
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
