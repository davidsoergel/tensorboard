import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { EffectsModule } from '@ngrx/effects';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment'; // Angular CLI environment

import { graphV2PluginReducer, INITIAL_GRAPH_V2_PLUGIN_STATE } from 'src/store';
import { GraphV2Effects } from 'src/store/graph/effects';
import { AppComponent } from './app.component';
import { GraphInfoContainerComponent } from './graph-info-container/graph-info-container.component';
import { GraphInfoComponent } from './graph-info/graph-info.component';

import { storeFreeze } from 'ngrx-store-freeze';
import { GraphV2PluginState } from 'src/store/types';
import { VisibleNodeComponent } from './visiblenode/visiblenode.component';
import { VisiblenodeContainerComponent } from './visiblenode-container/visiblenode-container.component';

export const metaReducers: Array<
  MetaReducer<GraphV2PluginState>
> = !environment.production ? [storeFreeze] : [];

@NgModule({
  declarations: [
    AppComponent,
    GraphInfoComponent,
    GraphInfoContainerComponent,
    VisibleNodeComponent,
    VisiblenodeContainerComponent,
  ],
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
