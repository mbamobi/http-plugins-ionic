import { NgModule } from '@angular/core';
import { HttpPluginsToken } from '@ramonornela/http';
import { IonicModule, LoadingController } from 'ionic-angular';
import { COMPONENTS } from './components';
import { LoadingIonicPlugin, NoConnectionPlugin } from './providers';

@NgModule({
  imports: [ IonicModule.forRoot(null) ],
  exports: [ COMPONENTS ],
  declarations: [ COMPONENTS ],
  providers: [
    { provide: HttpPluginsToken, useClass: LoadingIonicPlugin, deps: [ LoadingController ], multi: true },
    { provide: HttpPluginsToken, useClass: NoConnectionPlugin, multi: true }
  ]
})
export class HttpPluginsIonicModule {
}
