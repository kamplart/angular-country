import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: [
  ]
})
export class SearchBoxComponent implements OnInit, OnDestroy {



  private tuboDeAgua: Subject<string> = new Subject<string>();
  private debouncerSuscription?: Subscription;

  @Input()
  public placeholder: string = '';

  @Input()
  public initialValue: string = '';

  @Output()
  public onValue = new EventEmitter<string>();

  @Output()
  public onDebaounce = new EventEmitter<string>();




  ngOnInit(): void {

    this.debouncerSuscription = this.tuboDeAgua
      .pipe(
        debounceTime(500)
      )
      .subscribe(value => {
        this.onDebaounce.emit(value);
        //console.log('devoncer value', value);
      })
  }

  ngOnDestroy(): void {
    this.debouncerSuscription?.unsubscribe();
    //this.tuboDeAgua.unsubscribe();
  }

  emitValue(value: string): void {
    this.onValue.emit(value);
  }

  onKeyPress(searchTerm: string) {
    this.tuboDeAgua.next(searchTerm);
    this.tuboDeAgua.next(searchTerm);
  }

}
