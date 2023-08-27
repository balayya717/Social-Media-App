import { Component} from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { IPost } from '../post/post';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.css']
})
export class UpdatePostComponent{

  constructor(private data:DataService,
    private http:HttpClient,
    @Inject(MAT_DIALOG_DATA) public jsondata:any){}

    private httpOptions = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
    }; 

    selectedOption:string = "";

  onUpdatePost(title:HTMLInputElement,description:HTMLTextAreaElement){
    if(this.selectedOption.length >0)
    {
      this.http.put<IPost>('http://127.0.0.1:3000/post/'+this.jsondata.id+'/update_post',{
        title:title.value,
        description:description.value,
        category:this.selectedOption
      }, this.httpOptions).subscribe({
        next: () => {
          location.reload();
      },
      error: (err) => {
        alert(err.error.message);
      }
      });
    }
    else
    {
      alert("Please select whether the post is public or private...");
    }
    
  }
}
