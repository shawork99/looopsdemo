import { Pipe, PipeTransform } from '@angular/core';

interface StatusResult {
  label: string;
  cssClass: string;
}

@Pipe({
  name: 'statusLabel'
})
export class StatusLabelPipe implements PipeTransform {
  transform(confirmed_yn: number, approved_yn: number, rejected_yn: number): StatusResult {
    if (confirmed_yn === 0 && approved_yn === 0 && rejected_yn === 0) {
      return { label: 'Draft', cssClass: 'badge bg-secondary' };
    }
    if (confirmed_yn === 1 && approved_yn === 0 && rejected_yn === 0) {
      return { label: 'Pending Approval', cssClass: 'badge bg-primary' };
    }
    if (confirmed_yn === 1 && approved_yn === 1 && rejected_yn === 0) {
      return { label: 'Approved', cssClass: 'badge bg-success' };
    }
    if (confirmed_yn === 0 && approved_yn === 0 && rejected_yn === 1) {
      return { label: 'Rejected', cssClass: 'badge bg-danger' };
    }
    return { label: 'Unknown', cssClass: 'badge bg-dark' };
  }
}
