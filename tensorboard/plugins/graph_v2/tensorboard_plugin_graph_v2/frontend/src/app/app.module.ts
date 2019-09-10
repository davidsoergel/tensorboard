import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {StoreModule, MetaReducer} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment'; // Angular CLI environment
import {EffectsModule} from '@ngrx/effects';

import {AppComponent} from './app.component';
import {GraphV2Effects} from 'src/store/graph/effects';
import {GraphInfoComponent} from './graph-info/graph-info.component';
import {GraphInfoContainerComponent} from './graph-info-container/graph-info-container.component';
import {INITIAL_GRAPH_V2_PLUGIN_STATE, graphV2PluginReducer} from 'src/store';

import {storeFreeze} from 'ngrx-store-freeze';
import {GraphV2PluginState} from 'src/store/types';

export const metaReducers: MetaReducer<
  GraphV2PluginState
>[] = !environment.production ? [storeFreeze] : [];

@NgModule({
  declarations: [AppComponent, GraphInfoComponent, GraphInfoContainerComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot(graphV2PluginReducer, {
      initialState: INITIAL_GRAPH_V2_PLUGIN_STATE,
      metaReducers,
    }),
    EffectsModule.forRoot([GraphV2Effects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
