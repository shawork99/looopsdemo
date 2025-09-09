import {
    Component,
    ElementRef,
    inject,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    FormControl,
    FormGroup,
    Validators,
    ReactiveFormsModule,
    FormsModule,
} from '@angular/forms';
import {Store} from '@ngrx/store';
import {Subject, takeUntil} from 'rxjs';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AlertService} from '@/app/services/alert.service';
import {AsyncPipe, NgClass, NgIf} from '@angular/common';
import {
    ToggleSwitchComponentComponent
} from '@/app/shared/components/toggle-switch-component/toggle-switch-component.component';
import {TranslocoPipe} from '@jsverse/transloco';

import * as L from 'leaflet';
import {Location} from '@store/location/location.model';
import {
    createLocation,
    showLocationFormLoading,
    updateLocation,
} from '@store/location/location.actions';
import {
    selectShowLocationFormLoading,
    selectShowHideLocationForm,
} from '@store/location/location.selectors';
import {FormErrorsPipe} from "@/app/shared/pipes/form-errors.pipe";

@Component({
    selector: 'app-locations-form',
    templateUrl: './locations-form.component.html',
    styleUrls: ['./locations-form.component.scss'],
    standalone: true,
    imports: [
        AsyncPipe,
        FormsModule,
        NgIf,
        ReactiveFormsModule,
        NgClass,
        ToggleSwitchComponentComponent,
        FormErrorsPipe,
        TranslocoPipe
    ],
})
export class LocationsFormComponent implements OnInit, OnDestroy {
    public store = inject(Store);
    modalHeader: string;
    submitted = false;
    editLocation: Location;
    @ViewChild('leafletMap', {static: true}) leafletMap: ElementRef<HTMLDivElement>;
    private map: L.Map;
    private marker: L.Marker;
    private destroy$ = new Subject<void>();
    isLoading$ = this.store.select(selectShowLocationFormLoading);

    form: FormGroup = new FormGroup({
        location_code: new FormControl(null, Validators.required),
        location_name: new FormControl(null, Validators.required),
        latitude: new FormControl(null, Validators.required),
        longitude: new FormControl(null, Validators.required),
        radius: new FormControl(null, Validators.required),
        is_active: new FormControl(1, Validators.required),
    });

    constructor(public modal: NgbActiveModal, private alertService: AlertService) {
        this.store
            .select(selectShowHideLocationForm)
            .pipe(takeUntil(this.destroy$))
            .subscribe((show) => {
                if (!show) this.modal.close();
            });
    }

    ngOnInit(): void {
        // Initialize map after view is ready
        setTimeout(() => this.initMap(), 0);

        if (this.editLocation) {
            this.form.patchValue(this.editLocation);
            // Update marker position if editing existing location
            this.updateMarkerFromForm();
        }

        // Update marker when lat/lng fields change
        this.form.get('latitude')!.valueChanges.subscribe(() => this.updateMarkerFromForm());
        this.form.get('longitude')!.valueChanges.subscribe(() => this.updateMarkerFromForm());
    }

    private initMap(): void {
        const defaultLatLng: [number, number] = [7.8731, 80.7718]; // Sri Lanka center

        const lat = parseFloat(this.form.value.latitude);
        const lng = parseFloat(this.form.value.longitude);
        const initialLatLng: [number, number] =
            !isNaN(lat) && !isNaN(lng) ? [lat, lng] : defaultLatLng;

        this.map = L.map(this.leafletMap.nativeElement).setView(initialLatLng, 8);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(this.map);

        // ✅ Create custom icon
        const customIcon = L.icon({
            iconUrl: 'https://w7.pngwing.com/pngs/731/25/png-transparent-location-icon-computer-icons-google-map-maker-marker-pen-cartodb-map-marker-heart-logo-color-thumbnail.png', // Update this path as needed
            iconSize: [32, 32], // size of the icon
            iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
            popupAnchor: [0, -32], // point from which the popup should open relative to the iconAnchor
        });

        // ✅ Use the custom icon in the marker
        this.marker = L.marker(initialLatLng, {
            icon: customIcon,
            draggable: true,
        }).addTo(this.map);

        this.marker.on('dragend', () => {
            const position = this.marker.getLatLng();
            this.form.patchValue({
                latitude: position.lat.toFixed(6),
                longitude: position.lng.toFixed(6),
            });
        });
    }

    private updateMarkerFromForm(): void {
        if (!this.marker || !this.map) return;

        const lat = parseFloat(this.form.value.latitude);
        const lng = parseFloat(this.form.value.longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
            const latLng: L.LatLngExpression = [lat, lng];
            this.marker.setLatLng(latLng);
            this.map.panTo(latLng);
        }
    }

    onStatusChange(event: any) {
        this.form.patchValue({is_active: event});
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        if (this.map) {
            this.map.remove();
        }
    }

    onSubmit() {
        this.submitted = true;
        if (this.form.invalid) {
            this.alertService.showError('Please fill all required fields correctly.');
            return;
        }
        this.store.dispatch(showLocationFormLoading({show: true}));
        if (this.editLocation) {
            this.store.dispatch(updateLocation({locationId: this.editLocation.id, data: this.form.value}));
        } else {
            this.store.dispatch(createLocation({data: this.form.value}));
        }
    }
}
