import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';

import {AppComponent} from './app.component';
import {graphV2Reducer} from 'src/store';
import {GraphV2Effects} from 'src/store/effects';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot(graphV2Reducer),
    EffectsModule.forRoot([GraphV2Effects]),
    StoreDevtoolsModule.instrument({
      maxAge: 10,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
