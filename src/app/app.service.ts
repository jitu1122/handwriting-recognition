import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GOOGLE_API_KEY} from './app.constants';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as S3 from 'aws-sdk/clients/s3';


@Injectable({
  providedIn: 'root'
})
export class AppService {
  image: any;
  text = '';
  historyData = [];

  constructor(private http: HttpClient,
              private snackBar: MatSnackBar) {
  }

  getHistory() {
    if (localStorage.getItem('_H_R_DATA')) {
      const tempData = JSON.parse(localStorage.getItem('_H_R_DATA'));
      if (tempData && tempData.data) {
        this.historyData = tempData.data;
      }
    }
  }

  setHistory(data) {
    this.getHistory();
    this.historyData.push(data);
    localStorage.setItem('_H_R_DATA', JSON.stringify({data: this.historyData}));
  }

  async fileUpload(event: any) {
    const file = event && event.target && event.target.files ? event.target.files[0] : null;
    console.log(file);
    if (file && (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg')) {
      if (file.size < 2048000) {
        const FR = new FileReader();
        const _THIS = this;
        FR.addEventListener('load', (e) => {
          _THIS.image = e.target.result;
          _THIS.uploadFileToAWS(file);
        });
        FR.readAsDataURL(file);
      } else {
        this.snackBar.open('Invalid file size. File size should be less than 2mb.', null, {
          duration: 5000,
        });
      }
    } else {
      this.snackBar.open('Invalid file type. Please upload the image in PNG/JPG format only.', null, {
        duration: 5000,
      });
    }
  }

  uploadFileToAWS(file) {
    const contentType = file.type;
    const bucket = new S3({accessKeyId: 'AKIA4HEOBBWOIO4H4VBI', secretAccessKey: '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', region: 'us-east-1'});
    const params = {
      Bucket: 'jitu-personal',
      Key: 'raw-images/' + file.name,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };
    bucket.upload(params, (err, data) => {
      if (err) {
        this.snackBar.open('Image uploading failed.', null, {
          duration: 5000,
        });
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      this.getText(this.image.replace('data:image/png;base64,', '')).subscribe((r) => {
        this.text = r.responses[0].fullTextAnnotation.text;
        this.setHistory({image: data.Location, text: this.text});
      });
      return true;
    });
  }


  // Google Vision API Call with Base64Image
  getText(base64Image): Observable<any> {
    const body = {
      requests: [
        {
          image: {
            content: base64Image
          },
          features: [
            {
              type: 'DOCUMENT_TEXT_DETECTION',
              maxResults: 1
            }
          ]
        }
      ]
    };
    return this.http.post('https://vision.googleapis.com/v1/images:annotate?key=' + GOOGLE_API_KEY, body);
  }
}
