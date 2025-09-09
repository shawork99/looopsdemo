import {ElementRef, Pipe, PipeTransform, Renderer2} from '@angular/core';

@Pipe({
    name: 'formErrors'
})
export class FormErrorsPipe implements PipeTransform {
    errors: any[] = [];

    constructor(private el: ElementRef,
                private renderer: Renderer2) {
    }

    transform(errors: any): unknown {
        if (!errors) return null;
        this.errors = [];
        const message: string[] = [];
        if (errors?.hasOwnProperty('required')) {
            message.push('This field is required');
        }
        if (errors?.hasOwnProperty('minlength')) {
            message.push(`This field must be at least ${errors?.minlength?.requiredLength} characters long (currently ${errors?.minlength?.actualLength})`);
        }
        if (errors?.hasOwnProperty('maxlength')) {
            message.push(`This field must be no more than ${errors?.maxlength?.requiredLength} characters. You entered ${errors?.maxlength?.actualLength} characters`);
        }
        if (errors?.hasOwnProperty('min')) {
            message.push(`The value cannot be less than ${errors?.min?.min}`);
        }
        if (errors?.hasOwnProperty('max')) {
            message.push(`The value cannot be greater than ${errors?.max?.max}.`);
        }
        return this.renderErrors(message);
    }

    renderErrors(message: string[]): void {
        const parent = this.el.nativeElement.parentElement;
        const existingErrors = parent.querySelectorAll('.invalid-feedback');
        existingErrors.forEach((el: any) => {
            this.renderer.removeChild(parent, el);
        });
        if (message?.length > 0) {
            message.forEach(msg => {
                const errorDiv = this.renderer.createElement('div');
                this.renderer.addClass(errorDiv, 'invalid-feedback');
                this.renderer.appendChild(errorDiv, this.renderer.createText(msg));
                this.renderer.appendChild(parent, errorDiv);
            });
        }
    }
}