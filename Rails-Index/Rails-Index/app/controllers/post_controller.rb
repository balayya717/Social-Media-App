class PostController < AuthenticatorController
    protect_from_forgery with: :null_session

    before_action :authenticate_request

    def index
        if (can?(:index, Post))
            @posts = Post.all
            render json:{data: @posts}, status: 200
            # @posts = Post.includes(:likes, :comments).all
            # render json:{data: @posts.map { |post| post_data(post)}}, status: 200
        else
            # @posts = Post.includes(:likes, :comments).where(category: "public").or(Post.where(user_id: @current_user.id ))
            # render json:{data: @posts.map { |post| post_data(post)}}, status: 200
            @posts = Post.where(category: "public").or(Post.where(user_id: @current_user.id ))
            render json:{data: @posts}, status: 200
        end
        rescue => e
            render json: {success: false, message: "Posts not fetched"}, status: 400
    end

    def show
        @post = Post.find(params[:id])
        render json: {data: @post}, status: 200
        rescue => e
            render json: {success: false, message: "Posts not fetched"}, status: 400
    end 


    def create_post
        c_post = Post.new
        c_post.user_id = @current_user.id
        c_post.title = params[:title]
        c_post.description = params[:description]
        c_post.category = params[:category]
        c_post.save!
        render json: {success:true, message: "Post created successfully", data: c_post}, status:200
        rescue => e
            render json: {success: false, message: "Posts not fetched"}, status: 400
    end

    def update_post
        u_post = Post.find(params[:id])
        if u_post.user_id == @current_user.id
            u_post.update(
                title: params[:title],
                description: params[:description],
                category: params[:category]
            )
            render json: {success: true, message: "Post updated successfully", data: u_post}, status:200
        else
            render json: {success:false,message: "Post can't be updated as you didn't made it"}, status: 400
        end
        
        rescue => e
            render json: {success: false, message: "Post not updated as you didn't made it"}, status: 400
    end

    def destroy_post
        d_post = Post.find(params[:id])
        if(d_post.user_id == @current_user.id || can?(:destroy_post, Post))
            d_post.destroy!
            render json: {success:true, message: "Post deleted successfully"}, status: 200
        else
            render json: {success:false, message: "Post can't be deleted as you didn't made it."}, status: 400
        end
    rescue => e 
        render json: {success: false, message: "Post not updated as you didn't made it"}, status: 400
    end 

    private 
    def post_data(post)
        {
            id: post.id,
            title: post.title,
            content: post.content,
            likes_count: post.likes.where(entity_type: "Post", entity_id:post.id),
            comments_count: post.comments.count
        }
    end
end
