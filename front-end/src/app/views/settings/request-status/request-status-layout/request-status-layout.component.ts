import {Component} from '@angular/core';
import {NgbNavModule} from "@ng-bootstrap/ng-bootstrap";
import {RequestStatusTableComponent} from "../request-status-table/request-status-table.component";
import {NgFor} from "@angular/common";

@Component({
    selector: 'app-request-status-layout',
    standalone: true,
    imports: [
        NgbNavModule,
        RequestStatusTableComponent,
        NgFor
    ],
    templateUrl: './request-status-layout.component.html',
    styleUrl: './request-status-layout.component.scss'
})
export class RequestStatusLayoutComponent {
    active = 1;
    /** need to get data from the table */
    tabs = [
        {id: 1, title: 'Inquiry'},
        {id: 2, title: 'Credit Application'}
    ];

}
