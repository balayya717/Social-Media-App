import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { IUser } from '../authenticator/user';
import { TmplAstRecursiveVisitor } from '@angular/compiler';


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit{

  constructor(@Inject(MAT_DIALOG_DATA) private postid:number,
  private http:HttpClient,
  private dialog:MatDialog,
  public dialogRef: MatDialogRef<CommentComponent>){}

  private token = localStorage.getItem('token')

  private httpOptions = {
    headers : new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
  })
  }; 

  private commenthttpOptions = {
    headers : new HttpHeaders ({
      'Content-Type' : 'application/json',
      'Authorization' : 'Bearer '+this.token,
      'type' : 'Comment'
    })
  }

  comments:IComment[] = [];

  usercomments:UserComment[] = [];

  noOfComments:number=0;

  commentsLikes:LikeComment[] = [];
  likesReceived:any = [];

  ngOnInit(): void {
    this.http.get<IComment[]>('http://127.0.0.1:3000/post/'+this.postid+'/comments',this.httpOptions)
    .subscribe((res : IComment[]) => {
        const response = res as any;
        this.comments = response.data;
        if(response.data != null)
        {
          this.comments.sort((a, b) => b.id - a.id);
          this.noOfComments = this.comments.length;
          for(let i=0;i<this.comments.length;i++){
            this.http.post<IUser>('http://127.0.0.1:3000/user',{ id: this.comments[i].user_id})
            .subscribe((res) => {
              const commentData = res as any
              let myjson = {
                "comment_id":this.comments[i].id,
                "user_name": commentData.data.name
              }
              this.usercomments.push(myjson);
            })
          }
        }
      }
    );
    // this.data.changeMessage(this.noOfComments);
    // alert(this.noOfComments);


      this.http.post('http://127.0.0.1:3000/user/likes',{ id: parseInt(localStorage.getItem('currentId') ?? '0')},this.httpOptions)
      .subscribe({
        next: (res) =>{
          const response = res as any;
          this.likesReceived = response.data;
          for(let i=0;i<this.likesReceived.length;i++){
            if(this.likesReceived[i].entity_type == "Comment"){
              let myJson = {
                'id':this.likesReceived[i].entity_id,
                'isLiked':true
              }
              this.commentsLikes.push(myJson);
            }
          }
        }
      })
  }
  

  onClickComment(comment:HTMLInputElement){
    if(comment.value.length > 0)
    {
      this.http.post<IComment>('http://127.0.0.1:3000/post/'+this.postid+'/comments/create_comment',{
        content:comment.value
      },this.httpOptions).subscribe(() => {
        this.dialogRef.close();
        this.dialog.open(CommentComponent,{data:this.postid})
      });
    }
    else{
      alert('Enter some text to comment');
    }
  }

  onClickDeleteComment(commentid:number,postId:number){
    this.http.delete('http://127.0.0.1:3000/comments/'+commentid+'/destroy_comment',this.httpOptions)
    .subscribe({
      next: (res)=>{
        this.dialogRef.close();
        this.dialog.open(CommentComponent,{data:postId});
      },
      error: (err) =>{
        alert("You can't delete this comment as you are not the owner.");
      }
    })
  }

  getUserName(commentId:number){
    let obj = this.usercomments.find(item => item.comment_id === commentId);
    return obj?.user_name;
  }


  onClickCommentLike(commentId:number){
    let currInd = this.commentsLikes.findIndex(item => item.id == commentId);
    if(currInd == -1){
      let myJson = {
        'id':commentId,
        'isLiked':true 
      }
      this.commentsLikes.push(myJson);
      this.http.post('http://127.0.0.1:3000/post/'+commentId+'/like',{},this.commenthttpOptions).subscribe();
    }
    else if(this.commentsLikes[currInd].isLiked == false){
      this.commentsLikes[currInd].isLiked = true;
      this.http.post('http://127.0.0.1:3000/post/'+commentId+'/like',{},this.commenthttpOptions).subscribe();
    }
    else{
      this.commentsLikes[currInd].isLiked = false;
      this.http.delete('http://127.0.0.1:3000/post/'+commentId+'/dislike',this.commenthttpOptions).subscribe();
    }
  }

  commentLiked(commentId:number){
    let currInd = this.commentsLikes.findIndex(item => item.id == commentId);
    if(currInd==-1){
      return false;
    }
    if(this.commentsLikes[currInd].isLiked == true){
      return true;
    }
    else{
      return false;
    }
  }


}

export interface IComment{
  content:string,
  user_id:number,
  post_id:number,
  id:number
}

export interface UserComment{
  comment_id:number,
  user_name:string
}

export interface LikeComment{
  id:number,
  isLiked:boolean
}