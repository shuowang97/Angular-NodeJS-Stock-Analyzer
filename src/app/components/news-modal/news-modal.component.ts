import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-news-modal',
  templateUrl: './news-modal.component.html',
  styleUrls: ['./news-modal.component.css']
})
export class NewsModalComponent implements OnInit {

  @Input() url;
  @Input() publishDate;
  @Input() title;
  @Input() description;
  @Input() hostname;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
