import { Component, OnInit } from '@angular/core';
import {AppService} from '../app.service';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {

  constructor(public appService: AppService) { }

  ngOnInit(): void {
  }

  backClick() {
    this.appService.image = null;
    this.appService.text = '';
  }
}
