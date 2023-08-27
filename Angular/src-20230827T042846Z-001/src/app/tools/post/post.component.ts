import { Component, OnInit} from '@angular/core';
import { IPost } from './post';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { UpdatePostComponent } from '../update-post/update-post.component';
import { CommentComponent, IComment } from '../comment/comment.component';
import { IUser } from '../authenticator/user';
import { Router } from '@angular/router';
import { count } from 'rxjs';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit{

  public posts:any = [];
  public likes:any = [];

  postlikes:PostLike[] = [];

  searchtext:string = "";

  postId: any;
  isLiked:boolean=true;

  constructor(private http:HttpClient,
    private dialog:MatDialog,
    private router:Router) {}


  public comments:IComment[] = [];
  public users:PostUser[] = [];

  public postsOptions:PostOptions[] = [];

  private token = localStorage.getItem('token');
  isAdmin:boolean = false;
  

  private httpOptions = {
    headers : new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
  })
  }; 

  private likehttpOptions = {
    headers : new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
      'type' : "Post"
  })
  }; 



  public noOfLikes:number = 0;
  public user_name:string = "";

  public countLikes:{postId:number,likes:number,commentCount:number}[] = [];

  ngOnInit(): void {


    this.http.get('http://127.0.0.1:3000/post', this.httpOptions)
    .subscribe((postdata) => {
      const response = postdata as any;
      this.posts = response.data;
      for(let i=0;i<this.posts.length;i++){        
        this.http.post<IUser>('http://127.0.0.1:3000/user',{ id: this.posts[i].user_id})
        .subscribe({
          next: (userdata: IUser) => {  
          const res = userdata as any
          let myjson = {
            "post_id": this.posts[i].id,
            "user_name":  res.data.name
          }
          this.users.push(myjson);
          const newPost = {postId: this.posts[i].id,likes:0,commentCount:0};          
          this.countLikes.push(newPost);
        },
        error: () => {
          alert('dsacs');
          this.router.navigate(['/']);
        }
        });

        let json = {
          "post_id":this.posts[i].id,
          "isClicked":false
        }
        this.postsOptions.push(json);        
      }

      this.http.get('http://127.0.0.1:3000/likes',this.httpOptions)
      .subscribe({
        next: (res) => {
          const response = res as any;
          for(let i=0;i<response.data.length;i++){
            if(response.data[i].entity_type == "Post"){
              let postyy = this.countLikes.find(p => p.postId === response.data[i].entity_id);
              if(postyy){
                postyy.likes++;
              }
            }
          }
        },
        error: (err) => {
          console.log(err);
        }
      })

      this.http.get('http://127.0.0.1:3000/comments',this.httpOptions)
      .subscribe({
        next:(res) => {
          const response = res as any;
          for(let i=0;i<response.data.length;i++){
            let postyy = this.countLikes.find(p => p.postId === response.data[i].post_id);
            if(postyy){
              postyy.commentCount++;
            }
          }
        }
      })

      });
  
    
    this.http.post('http://127.0.0.1:3000/user/likes',{ id: parseInt(localStorage.getItem('currentId') ?? '0')},this.httpOptions)
    .subscribe((likedata) => {
      const response = likedata as any;
      this.likes = response.data;
      // console.log(response.data[0].entity_type);
      
      for(let i=0;i<this.likes.length;i++){
        if(this.likes[i].entity_type == "Post"){
          let myJson = {
            "id" : this.likes[i].entity_id,
            "isLiked" : true
          }
          this.postlikes.push(myJson);
        }
      }
    })

    this.http.post('http://127.0.0.1:3000/user/role',{ id : parseInt(localStorage.getItem('currentId') ?? '0')})
    .subscribe({
      next: () =>{
        this.isAdmin=true;
      },
      error: () => {
        this.isAdmin=false;
      }
    });
    
    // this.data.currentMessage.subscribe(message => this.commentsNumber=message);

  }

  post_name(postId:number){
    let obj = this.users.find(item => item.post_id === postId);
    return obj?.user_name;
  }


  onClickDelete(postid:number)
  {
    this.http.delete('http://127.0.0.1:3000/post/'+postid+'/delete_post', this.httpOptions)
    .subscribe({
      next: () =>{
        location.reload();
      },
      error: () =>{
        alert("You can't delete this post as you are not the owner");
      }
    });
  }

  onUpdateClick(posttitle:string,postDescription:string,postid:number){
    let myjson = {
      title: posttitle,
      description: postDescription,
      id:postid
    }    
    this.dialog.open(UpdatePostComponent,{data:myjson});
    //this.data.changeMessage(postid);
  }

  onClickedComment(postid:number){
    this.dialog.open(CommentComponent,{data:postid});
  }
  
  onClickCurrentComment(postid:number,comment:HTMLInputElement){
    if(comment.value.length > 0)
    {
      this.http.post<IComment>('http://127.0.0.1:3000/post/'+postid+'/comments/create_comment',{
        content:comment.value
      },this.httpOptions).subscribe(() => {
        location.reload();
      });
    }
    else{
      alert('Enter some text to comment');
    }
  }

  onClickLike(postID:number){
    let currInd= this.postlikes.findIndex(item => item.id === postID);
    if(currInd == -1){
      let myJson = {
        "id" : postID,
        "isLiked" : true
      }
      this.postlikes.push(myJson);
      let postyy = this.countLikes.find(p => p.postId === postID);
      if(postyy){
        postyy.likes++;
      }
      this.http.post('http://127.0.0.1:3000/post/'+postID+'/like',{},this.likehttpOptions).subscribe();
    }
    else if(this.postlikes[currInd].isLiked == true){
      this.postlikes[currInd].isLiked = false;
      let postyy = this.countLikes.find(p => p.postId === postID);
      if(postyy){
        postyy.likes--;
      }
      this.http.delete('http://127.0.0.1:3000/post/'+postID+'/dislike',this.likehttpOptions).subscribe();
    }
    else{
      this.postlikes[currInd].isLiked = true;
      let postyy = this.countLikes.find(p => p.postId === postID);
      if(postyy){
        postyy.likes++;
      }
      this.http.post('http://127.0.0.1:3000/post/'+postID+'/like',{},this.likehttpOptions).subscribe();
    }
  }

  getLikeCount(postId:number){
    return this.countLikes.find(p => p.postId === postId)?.likes;
  }

  getCommentCount(postId:number){
    return this.countLikes.find(p => p.postId === postId)?.commentCount;
  }

  postLiked(postId:number){
    let currInd = this.postlikes.findIndex(item => item.id === postId);
    if(currInd == -1)
    {
      return false; 
    }
    if(this.postlikes[currInd].isLiked ==true){
      return true;
    }
    else{
      return false;
    }
  }

  isClickedFrame:boolean = false;

  onClickGroupMenu(postId:number){
    let currInd = this.postsOptions.findIndex(item => item.post_id === postId);
    if(this.postsOptions[currInd].isClicked == false){
      this.postsOptions[currInd].isClicked = true;
    }
    else{
      this.postsOptions[currInd].isClicked = false;
    }
  }

  isClickedOptions(postId:number){    
    return this.postsOptions[this.postsOptions.findIndex(item => item.post_id === postId)].isClicked;
  }

  

  getCreator(userId:number){
    

    if(parseInt(localStorage.getItem('currentId') ?? '0') == userId){
      return true;
    }
    return false;
  }
}


export interface ILike{
  user_id:number,
  post_id:number,
  id:number
}

export interface PostLike{
  id:number,
  isLiked:boolean
}

export interface PostUser{
  post_id:number,
  user_name:string
}

export interface PostOptions{
  post_id:number,
  isClicked:boolean
}