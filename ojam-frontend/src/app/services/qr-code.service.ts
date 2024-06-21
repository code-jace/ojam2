import { Injectable } from '@angular/core';
import QRCode from 'qrcode'


@Injectable({
  providedIn: 'root'
})
export class QrCodeService {

  constructor() { }

  generateQRCode(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      QRCode.toDataURL(url, (err, qrCodeUrl) => {
        if (err) {
          reject(err);
        } else {
          resolve(qrCodeUrl);
        }
      });
    });

  }
}
