import {ThemeService} from '@/app/services/theme.service'
import {CommonModule, DOCUMENT} from '@angular/common'
import {
    ChangeDetectorRef,
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    ElementRef,
    HostListener,
    Inject, OnDestroy,
    OnInit,
    Renderer2,
    RendererFactory2,
} from '@angular/core'
import {RouterLink} from '@angular/router'
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap'
import * as feather from 'feather-icons'
import {SimplebarAngularModule} from 'simplebar-angular'
import {Store} from "@ngrx/store";
import {getAuthUser, getSystemLanguage} from "@store/authentication/authentication.selector";
import {User} from "@store/authentication/auth.model";
import {Subject, takeUntil} from "rxjs";
import {logout, onSystemLanguageChanged} from "@store/authentication/authentication.actions";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslocoService} from "@jsverse/transloco";
import {EncryptionService} from "@/app/services/encryption.service";
import {localStorageKeys} from "@/app/shared/config/common.config";

@Component({
    selector: 'app-topbar',
    imports: [NgbDropdownModule, SimplebarAngularModule, RouterLink, CommonModule, ReactiveFormsModule, FormsModule,],
    templateUrl: './topbar.component.html',
    styles: ``,
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TopbarComponent implements OnInit, OnDestroy {
    isSidebarVisible = true
    isFullscreen: boolean = false
    // private theme: string = 'light';
    private config = {theme: 'light'};
    authUser: User | null = null;
    private destroy$ = new Subject<void>();
    systemLanguage: string = 'en';
    greetingMessage: string = '';

    constructor(
        private renderer: Renderer2,
        private el: ElementRef,
        @Inject(DOCUMENT) private document: any,
        private cdr: ChangeDetectorRef,
        private themeService: ThemeService,
        private translocoService: TranslocoService,
        rendererFactory: RendererFactory2,
        private store: Store
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    elem: any

    ngOnInit() {
        this.setGreetingMessage();
        this.elem = document.documentElement
        this.updateOnWindowResize()
        this.themeService.initTheme();
        feather.replace();
        this.store.select(getAuthUser).pipe(
            takeUntil(this.destroy$)
        ).subscribe(user => {
            this.authUser = user;
        });
        this.store.select(getSystemLanguage).pipe(
            takeUntil(this.destroy$)
        ).subscribe(lang => {
            this.systemLanguage = lang;
            this.translocoService.setActiveLang(this.systemLanguage);
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    changeSystemLanguage(lang: string) {
        localStorage.setItem(localStorageKeys.systemLanguage, EncryptionService.encrypt(lang));
        this.systemLanguage = lang;
        this.store.dispatch(onSystemLanguageChanged({language: lang}));
    }


    get theme(): string {
        return this.themeService.getTheme();
    }

    changeTheme(): void {
        this.themeService.changeTheme();
        setTimeout(() => {
            feather.replace();
            const themeIcon = document.getElementById('theme-icon');
            if (themeIcon) {
                themeIcon.setAttribute('data-feather', this.theme === 'light' ? 'sun' : 'moon');
                feather.replace();
            }
        }, 100);
    }

    onToggleSidebar() {
        this.isSidebarVisible = !this.isSidebarVisible
        this.updateBodyAttribute()
    }

    updateBodyAttribute() {
        const body = this.el.nativeElement.ownerDocument.body
        if (this.isSidebarVisible) {
            this.renderer.setAttribute(body, 'data-sidebar', 'default')
        } else {
            this.renderer.setAttribute(body, 'data-sidebar', 'hidden')
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        this.updateOnWindowResize()
    }

    updateOnWindowResize() {
        const body = document.body
        if (window.innerWidth < 1040) {
            this.renderer.setAttribute(body, 'data-sidebar', 'hidden')
        } else {
            this.renderer.setAttribute(body, 'data-sidebar', 'default')
        }
    }

    openFullscreen() {
        const elem: any = document.documentElement;
        console.log(this.isFullscreen);
        if (!this.isFullscreen) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            }
            this.isFullscreen = true;
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            this.isFullscreen = false;
        }

        setTimeout(() => {
            feather.replace();
            const fullscreenIcon = document.getElementById('fullscreen-icon');
            if (fullscreenIcon) {
                fullscreenIcon.setAttribute('data-feather', this.isFullscreen ? 'minimize' : 'maximize');
                feather.replace();
            }
        });
    }

    logout() {
        this.store.dispatch(logout())
    }

    private setGreetingMessage(): void {
        const currentHour = new Date().getHours();

        if (currentHour >= 5 && currentHour < 12) {
        this.greetingMessage = 'Good Morning';
        } else if (currentHour >= 12 && currentHour < 17) {
        this.greetingMessage = 'Good Afternoon';
        } else if (currentHour >= 17 && currentHour < 21) {
        this.greetingMessage = 'Good Evening';
        } else {
        this.greetingMessage = 'Good Night';
        }
    }
}
