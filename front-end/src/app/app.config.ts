import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core'
import { InMemoryScrollingFeature, InMemoryScrollingOptions, provideRouter, withInMemoryScrolling } from '@angular/router'
import { provideStoreDevtools } from '@ngrx/store-devtools'
import {BrowserAnimationsModule, provideAnimations} from '@angular/platform-browser/animations'

import { routes } from './app.routes'
import { provideStore } from '@ngrx/store'
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch, withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http'
import { DecimalPipe } from '@angular/common'
import { CookieService } from 'ngx-cookie-service'
import { BrowserModule } from '@angular/platform-browser'
import { rootReducer } from './store'
import { AuthenticationEffects } from '@store/authentication/authentication.effects'
import { CalendarEffects } from '@store/calendar/calendar.effects'
import { provideEffects } from '@ngrx/effects'
import { ErrorInterceptor } from './helper/error.interceptor'
import { FeatherModule } from 'angular-feather'
import { allIcons } from 'angular-feather/icons'
import {JwtInterceptor} from "@/app/helper/jwt.interceptor";
import {provideToastr} from "ngx-toastr";
import {NgxSpinnerModule} from "ngx-spinner";
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
}

const inMemoryScrollingFeatures: InMemoryScrollingFeature =
  withInMemoryScrolling (scrollConfig)

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(), // required animations providers
    provideToastr(),
    provideTransloco({
      config: {
        availableLangs: ['en', 'es'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    DecimalPipe,
    CookieService,
    importProvidersFrom(NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })),
    provideZoneChangeDetection({   eventCoalescing: false,
      runCoalescing: false,
      ignoreChangesOutsideZone: true,}),
    provideRouter(routes,inMemoryScrollingFeatures),
    provideStore(rootReducer, {
      metaReducers: [],
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
        strictStateSerializability: false,
        strictActionSerializability: false,
      }
    }),
    importProvidersFrom(BrowserAnimationsModule, BrowserModule),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects(AuthenticationEffects, CalendarEffects),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    importProvidersFrom(FeatherModule.pick(allIcons)), provideHttpClient(), provideTransloco({
        config: { 
          availableLangs: ['en'],
          defaultLang: 'en',
          // Remove this option if your application doesn't support changing language in runtime.
          reRenderOnLangChange: true,
          prodMode: !isDevMode(),
        },
        loader: TranslocoHttpLoader
      }), provideHttpClient(), provideTransloco({
        config: { 
          availableLangs: ['en', 'es'],
          defaultLang: 'en',
          // Remove this option if your application doesn't support changing language in runtime.
          reRenderOnLangChange: true,
          prodMode: !isDevMode(),
        },
        loader: TranslocoHttpLoader
      }),
  ],
}
