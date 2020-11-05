import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {PricePair} from '../../models/pricePair';

@Component({
  selector: 'app-buy-modal',
  templateUrl: './buy-modal.component.html',
  styleUrls: ['./buy-modal.component.css']
})
export class BuyModalComponent implements OnInit {
  @Input() price;
  @Input() ticker;
  @Input() isSelling;
  @ViewChild('qtyInput') input: ElementRef;

  quantityControl = new FormControl('0');
  totalPrice = parseFloat((0).toFixed(2));
  quantity: number;
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {

    setTimeout(() => {
      this.input.nativeElement.focus();
      // document.getElementById('qty-input').defaultValue = '0';
    }, 100);

    this.quantityControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(res => {
      this.quantity = res;
      if (this.quantity > 0) {
        this.totalPrice = parseFloat((parseInt(res, 10) * this.price).toFixed(2));
      } else {
        this.totalPrice = parseFloat((0).toFixed(2));
      }
    });
  }

  triggerTransaction(): void {
    const pricePair = new PricePair(this.quantity, this.totalPrice);
    this.activeModal.close(pricePair);
  }

  qtyCheck(): boolean {
    return this.totalPrice <= 0;
  }
}
