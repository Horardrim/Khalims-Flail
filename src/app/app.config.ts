import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHighcharts } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHighcharts({ instance: () => Promise.resolve(Highcharts) })
  ]
};
