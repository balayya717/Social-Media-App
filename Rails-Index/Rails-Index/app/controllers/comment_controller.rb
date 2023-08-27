class CommentController < AuthenticatorController
    protect_from_forgery with: :null_session
    before_action :authenticate_request

    def index
        @comments = Comment.all
        render json:{data: @comments}, status: 200
        rescue => e
            render json: {success: false, message: "Comments not fetched"}, status: 400
    end

    def show
        s_comment = Comment.where(post_id: params[:id])
        render json: {success: true, message: "All comments on this post", data: s_comment}, status: 200
    rescue => e 
        render json: {success: false, message: "All comments not fetched", data: "null"}, status:400
    end

    def create_comment 
        c_comment = Comment.new
        c_comment.user_id = @current_user.id
        c_comment.post_id = params[:id]
        c_comment.content = params[:content]
        c_comment.save!
        render json: {success: true, message: "Comment created successfully", data: c_comment}, status: 200
    rescue => e 
        render json: {success: false, message: "Comment not created", data:c_comment}, status: 400
    end

    def update_comment
        u_comment = Comment.find(params[:id])
        if(u_comment.user_id == @current_user.id)
            u_comment.update(comment_params)
            render json: {success:true, message:"Comment updated successfully", data:u_comment}
        else
            render json: {success:false}, status: 400
        end
    rescue => e 
        render json: {success:false, message:"Comment not updated", data:u_post}
    end

    def destroy_comment
        d_comment = Comment.find(params[:id])
        if(d_comment.user_id == @current_user.id || can?(:destroy_comment, Comment))
            d_comment.destroy!
            render json: {success:true, message:"Comment destroyed successfully"}
        else
            render json: {success:false}, status: 400
        end
    rescue => e 
        render json: {success:false, message:"Comment not deleted", data:comments}
    end


    private
    def comment_params
        params.require(:comment).permit(:content)
    end
end
