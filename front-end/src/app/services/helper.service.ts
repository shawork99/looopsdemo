import { Injectable } from '@angular/core';
import {HttpParams} from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})
export class HelperService {

    constructor() { }

    convertToHttpParams(filter: any): HttpParams {
        let params = new HttpParams();
        Object.keys(filter).forEach(key => {
            if (filter[key] != null) {
                params = params.append(key, filter[key].toString());
            }
        });
        return params;
    }
}
