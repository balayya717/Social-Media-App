import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';


 
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit{

  selectedOption:string = '';

  constructor(private http:HttpClient){}


  ngOnInit(): void {
    
}

private httpOptions = {
  headers : new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
})
}; 
    

  onCreatePost(title:HTMLInputElement,description:HTMLTextAreaElement){
    if(title.value.length >0 && description.value.length >0 && this.selectedOption.length>0)
    {
      console.log(this.selectedOption);
      
      let c_title = title.value;
      let c_description = description.value;
      this.http.post('http://127.0.0.1:3000/post/create_post',{
        title:c_title,
        description:c_description,
        category : this.selectedOption
      },this.httpOptions).subscribe({
        next: (res) => {
          console.log(localStorage.getItem('currentEmail'));
          console.log(res);
          
        location.reload();
        },
        error: (err) => {
          console.log(err);
          
        }
      });
    }
    else
    {
      alert("Don't leave any of the fields empty.")
    }
    
  }

  
}
