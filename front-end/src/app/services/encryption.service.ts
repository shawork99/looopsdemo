import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class EncryptionService {

    constructor() { }

    public static encrypt(data: any): string {
        const stringData = JSON.stringify(data);
        return CryptoJS.AES.encrypt(stringData, environment?.secretKey).toString();
    }

    public static decrypt(ciphertext: string): any {
        const bytes = CryptoJS.AES.decrypt(ciphertext, environment?.secretKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted);
    }
}
