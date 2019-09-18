import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';

import {AppComponent} from './app.component';
import {GraphV2Effects} from 'src/store/graph/effects';
import {GraphInfoComponent} from './graph-info/graph-info.component';
import {GraphInfoContainerComponent} from './graph-info-container/graph-info-container.component';
import {initialState, graphV2PluginReducer} from 'src/store';

@NgModule({
  declarations: [AppComponent, GraphInfoComponent, GraphInfoContainerComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot(graphV2PluginReducer, {initialState}),
    EffectsModule.forRoot([GraphV2Effects]),
    StoreDevtoolsModule.instrument({
      maxAge: 10,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
