import { Component } from '@angular/core';
import { UserService } from './user.service';


@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.css']
})
export class AuthenticatorComponent {


  state = AuthenticatorCompState.LOGIN;

  constructor(private userService : UserService) {}

  onCreateAccountClick(){
    this.state = AuthenticatorCompState.REGISTER;
  }

  onLoginClick(){
    this.state = AuthenticatorCompState.LOGIN;
  }

  isLoginState()
  {
    return this.state == AuthenticatorCompState.LOGIN;
  }

  isRegisterState(){
    return this.state == AuthenticatorCompState.REGISTER;
  }

  getStateText(){
    switch(this.state){
      case AuthenticatorCompState.LOGIN:
        return "Login";
      case AuthenticatorCompState.REGISTER:
        return "Create an Account";
    }

  }


  clickedCreate(cname:HTMLInputElement, cemail:HTMLInputElement,cpassword:HTMLInputElement,crpassword:HTMLInputElement,phoneNumber:HTMLInputElement)
  {
      let c_user_name = cname.value;
      let c_email = cemail.value;
      let c_password = cpassword.value;
      let cr_password = crpassword.value;
      let c_number = phoneNumber.value;
      if(c_email.length==0 || c_user_name.length==0 || c_password.length==0 || c_number.length==0)
      {
        alert("Don't leave any of the fields empty");
      }
      else if(
        this.isNotEmpty(c_user_name) &&
        this.isNotEmpty(c_email) &&
        this.isNotEmpty(c_password) &&
        this.isAMatch(c_password,cr_password)&&
        this.isNotEmpty(cr_password)
      )
      {

        this.userService.postMethod(c_user_name,c_email, c_password,c_number);
        
      }
      else{
        alert("Password is not matching");
      }

  }

  isSuccessful:boolean = false;

  onCLickedLogin(email:HTMLInputElement,password:HTMLInputElement){
     let l_email = email.value;
     let l_password = password.value;
     if(l_email.length == 0 || l_password.length == 0)
     {
      alert("Don't leave any of the fields empty.");
      return;
     }
     else{
      this.userService.loginMethod(l_email,l_password);
      // this.router.navigate(['/postfeed']);
     }
  }


  isNotEmpty(text:string)
  {
    return text != null && text.length >0;
  }

  isAMatch(text:string, compareWith:string)
  {
    return text === compareWith;
  }


}

export enum AuthenticatorCompState{
  LOGIN,
  REGISTER
}