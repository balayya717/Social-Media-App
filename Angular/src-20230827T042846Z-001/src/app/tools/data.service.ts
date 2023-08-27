import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(){ }

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();



  changeMessage(noOfComments:number){
    this.messageSource.next(noOfComments);
  }


}
