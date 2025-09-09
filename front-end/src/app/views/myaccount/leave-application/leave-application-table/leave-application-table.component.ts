import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from "@components/breadcrumb/breadcrumb.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
    NgbModal,
    NgbModalConfig,
    NgbPagination,
    NgbPaginationNext,
    NgbPaginationPrevious
} from "@ng-bootstrap/ng-bootstrap";
import { LeaveApplicationFormComponent } from '../leave-application-form/leave-application-form.component';

@Component({
  selector: 'app-leave-application-table',
  imports: [
    BreadcrumbComponent,
    FormsModule,
    ReactiveFormsModule,
    NgbPagination,
    NgbPaginationNext,
    NgbPaginationPrevious,
  ],
  templateUrl: './leave-application-table.component.html',
  styleUrl: './leave-application-table.component.scss'
})
export class LeaveApplicationTableComponent {
  private modalService = inject(NgbModal);
  filter: any = {
    search: null,
    perPage: 10,
    page: 1
  };

   constructor(
      config: NgbModalConfig
  ){}

  onSearch(){

  }
  goToAdd(){
    const modalRef = this.modalService.open(LeaveApplicationFormComponent, {size: 'md'});
      modalRef.componentInstance.modalHeader = 'Add Leave Application';
      modalRef.result.then((data) => {
        
      });
    }

}
