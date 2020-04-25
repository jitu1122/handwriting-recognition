import { Component, OnInit } from '@angular/core';
import {AppService} from '../app.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-previous-results',
  templateUrl: './previous-results.component.html',
  styleUrls: ['./previous-results.component.scss']
})
export class PreviousResultsComponent implements OnInit {

  constructor(public appService: AppService,
              private router: Router) {
    this.appService.getHistory();
  }

  ngOnInit(): void {
  }

  showResult(data) {
    this.appService.image = data.image;
    this.appService.text = data.text;
    this.router.navigate(['/']);
  }
}
