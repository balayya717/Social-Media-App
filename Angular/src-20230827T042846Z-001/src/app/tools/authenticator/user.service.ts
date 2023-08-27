import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticatorComponent } from './authenticator.component';
import { MatBottomSheet} from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient,
    private loginSheet: MatBottomSheet,
    private router: Router) { }
  

  postMethod(name:string,email:string,password:string,phoneNumber:string)
  {
    this.http.post("http://127.0.0.1:3000/sign_up", {
      name:name,
      email:email,
      password:password,
      phone_number:phoneNumber
    }).subscribe({
      next: (response) => {
        console.log(response);
        alert("Account created successfully. Please login to continue....");
        this.loginSheet.open(AuthenticatorComponent);
      },
      error: (response) => {
        alert(response.error.message);
      }
  });
  }

  loginMethod(email:string, password:string){
    this.http.post('http://127.0.0.1:3000/login',{
      email: email,
      password: password
    }).subscribe({
      next: (response) => {
        const res = response as any
        const token = res.token        
        localStorage.setItem('token',token);
        localStorage.setItem('currentEmail',email);
        localStorage.setItem('currentId',res.data.id);
        this.router.navigate(['/postfeed']);
        this.loginSheet.dismiss();
      },
      error: (error) => {
        alert(error.error.message);
      }
    });
  }
  


}
