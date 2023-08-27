import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostComponent } from '../create-post/create-post.component';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { HttpClient } from '@angular/common/http';
import {IUser} from '../../tools/authenticator/user'
import { HttpHeaders } from '@angular/common/http';
import { NumberValueAccessor } from '@angular/forms';


@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.css']
})
export class PostFeedComponent implements OnInit{

  user_name:string = "";

  isPostFeed:boolean = true;
  isUserInfo:boolean = false;
  isManagebg:boolean = false;
  isReportsBg:boolean = false;
  isAdmin:boolean = false;

  token:string = localStorage.getItem('token') ?? "";

  private httpOptions = {
    headers : new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
  })
  }; 


  ngOnInit(): void {
    if(localStorage.getItem('token') == null){
      this.router.navigate(['/']);
      alert('Please login to continue..');
    }
    else{
      this.http.post<IUser>('http://127.0.0.1:3000/user',{ id: parseInt(localStorage.getItem('currentId') ?? '0')})
        .subscribe((userdata: IUser) => {  
          const res = userdata as any
          this.user_name = res.data.name;
        });      

    this.http.post('http://127.0.0.1:3000/user/role',{ id : parseInt(localStorage.getItem('currentId') ?? '0')})
    .subscribe({
      next: () =>{
        this.isAdmin=true;
      },
      error: () => {
        this.isAdmin=false;
      }
    });
    }
    

  }

  constructor(private dialog: MatDialog,
    private router:Router,
    private http:HttpClient){}

  onCreatePost(){
    this.dialog.open(CreatePostComponent);
  }

  onClickedLogout(){
    localStorage.clear();
    this.router.navigate(['']);
  }


  clickedPostFeed(){
    this.isPostFeed = true;
    this.isUserInfo = false;
    this.isManagebg = false;
    this.isAdminCreateUSer = false;
    this.isReportsBg = false;
  }

  userName:string='';
  eMail:string="";
  phoneNumber:string="";
  clickedUserInfo(){
    this.isPostFeed = false;
    this.isUserInfo = true;
    this.isManagebg = false;
    this.isReportsBg = false;
    this.isAdminCreateUSer = false;
    this.http.post('http://127.0.0.1:3000/user',{ id: parseInt(localStorage.getItem('currentId') ?? '0')})
    .subscribe({
      next: (res) => {
        const response = res as any;
        this.userName = response.data.name;
        this.eMail = response.data.email;
        this.phoneNumber = response.data.phone_number;
      }
    })
  }

  allUsers:any = [];

  getUsers(){
    this.isPostFeed = false;
    this.isUserInfo = false;
    this.isManagebg = true;
    this.isReportsBg = false;
    this.isAdminCreateUSer = false;
    this.http.get('http://127.0.0.1:3000/users/all', this.httpOptions)
    .subscribe({
      next: (res) => {
        const response = res as any;
        this.allUsers = response.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onClickStatus(userId:number){
    if(this.allUsers.find((item:any) => item.id == userId).status == 'active'){
      this.allUsers.find((item:any) => item.id == userId).status = 'deactive';
      this.http.put('http://127.0.0.1:3000/users/status',{
        id: userId,
        status: "deactive"
      }, this.httpOptions).subscribe();
    }
    else{
      this.allUsers.find((item:any) => item.id == userId).status = 'active';
      this.http.put('http://127.0.0.1:3000/users/status',{
        id: userId,
        status: "active"
      }, this.httpOptions).subscribe();
    }
  }

  textOfStatus:string='';
  
  isUserActivated(userId:number){    
    if( this.allUsers.find((item:any) => item.id == userId).status === "active"){
      this.textOfStatus = "Deactivate";
      return true;
    }
    else{
      this.textOfStatus = "Activate";
      return false;
    }
  }

  isAdminCreateUSer:boolean = false;

  onAdduserByAdmin(){
    this.isAdminCreateUSer = true;
    this.isManagebg = false;
  }

  onClickedCreateByAdmin(name:HTMLInputElement, email:HTMLInputElement, number:HTMLInputElement){
    let c_name = name.value;
    let c_email = email.value;
    let c_number = number.value;
    if(c_name.length ==0 || c_email.length==0 || c_number.length==0){
      alert("Don't leave any of the fields empty.");
    }
    else{
      this.http.post('http://127.0.0.1:3000/sign_up',{
        email: c_email,
        name: c_name,
        password: 'abcd@123',
        phone_number : c_number
      }).subscribe({
        next: (res) => {
          alert("User created successfully with default password : abcd@123");
          this.isAdminCreateUSer = false;
          // this.isAdmin = true;
          // this.isManagebg = true;
          location.reload();
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }

  allDownloadedOption:string='';
  specifiedDownloadedOption:string='';
  postsOption:string='';
  userDetailsDownloadOption:string='';

  onClickDownloadAll(){
    const headers = new HttpHeaders({
      Accept: 'text/csv',
      'Authorization': 'Bearer ' + this.token
    });
    this.http.get('http://127.0.0.1:3000/users/all_user_list.csv',{headers, responseType: 'text'}).subscribe({
      next: (res) => {
        if(this.allDownloadedOption.length!=0){
          this.downloadCsv(res,this.allDownloadedOption,'AllUsers');
        }
        else{
          alert('Please select the format...');
        }        
      },
      error: (err) => {
        console.log(err);  
      }
    });
  }

  onClickDownloadSpecified(){
    const headers = new HttpHeaders({
      Accept: 'text/csv',
      'Authorization':'Bearer ' +this.token
    });
    this.http.get('http://127.0.0.1:3000/users/users_list.csv',{headers,responseType: 'text'}).subscribe({
      next: (res) =>{
        if(this.specifiedDownloadedOption.length!=0){
          this.downloadCsv(res,this.specifiedDownloadedOption,'Users');
        }
        else{
          alert('Please select the format...');
        }
      },
      error: (err) =>{
        console.log(err);
        
      }
    })
  }

  onClickDownloadPosts(){
    const headers = new HttpHeaders({
      Accept: 'text/csv',
      'Authorization':'Bearer ' + this.token
    });    
    this.http.get('http://127.0.0.1:3000/grab_all_posts.csv',{headers, responseType:'text'}).subscribe({
      next: (res) =>{
        if(this.postsOption.length != 0){
          this.downloadCsv(res,this.postsOption,'Posts');
        }
        else{
          alert('Please select the format...');
        }
      },
      error: (err) =>{
        console.log(err); 
      }
    })
  }

  onClickUserDetails(){
    const headers = new HttpHeaders({
      Accept: 'text/csv',
      'Authorization':'Bearer ' + this.token
    });
    
    this.http.get('http://127.0.0.1:3000/users/details.csv',{headers, responseType:'text'}).subscribe({
      next: (res) => {
        if(this.userDetailsDownloadOption.length !=0){
          this.downloadCsv(res,this.userDetailsDownloadOption,'AllUsersDetails');
        }
        else{
          alert('Please select the format...');
        }
      },
      error: (err) => {
        console.log(err);   
      }
    })
  }

  getReports(){
    this.isReportsBg=true;
    this.isPostFeed=false;
    this.isUserInfo=false;
    this.isManagebg = false;
    this.isAdminCreateUSer=false;
  }



  downloadCsv(csvData : string,option:string,name:string){
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name+'.'+option;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  selectedFile:File | null = null;

  onFileSelected(event:Event):void{
    const inputElement = event.target as HTMLInputElement;
    if(inputElement.files && inputElement.files.length>0){
      this.selectedFile = inputElement.files[0];
    }
  }

  onUpload(){
    if(this.selectedFile){
      const headers = new HttpHeaders({
        Accept: 'text/csv',
        'Authorization':'Bearer ' + this.token
      });
      const formData = new FormData;
      formData.append('file',this.selectedFile);

      this.http.post('http://127.0.0.1:3000/user/upload',formData, {headers,responseType:'text'}).subscribe({
        next: (res) => {
          alert("File uploaded successfully...");
          location.reload();
        },
        error: (err) =>{
          console.log(err);
        }
      });
    }
  }
}
