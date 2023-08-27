class LikeController < AuthenticatorController

    protect_from_forgery with: :null_session
    before_action :authenticate_request
    
    def index
        likes = Like.all
        render json: {success:true, message:"All likes fetched sucessfully",data:likes}
    rescue => e
        render json: {success:false, message:"Likes not fetched"}
    end

    def user_likes
        u_likes = Like.where(user_id: params[:id])
        render json: {success:true, data:u_likes}
    rescue => e 
        render json: {success:false, message:"Likes not fetched"}
    end

    def show_like
        s_like = Likes.find_by(post_id: params[:id])
        render json: {success:true, message:"All likes on this post fetched sucessfully",data:s_like}
    rescue => e
        render json: {success:false, message:"Likes not fetched"}
    end

    def create_like
        c_like = Like.new
        c_like.user_id=@current_user.id
        c_like.entity_id = params[:id]
        c_like.entity_type = request.headers['type']
        c_like.save!
        render json: {success:true, message:"You liked the post"},status:200
    rescue => e
        render json: {success:false, message:"Like not created "},status:400
    end

    def destroy_like
        d_like = Like.where(entity_id:params[:id], entity_type: request.headers['type'])
        if d_like.any?
            d_like.each do |singleLike|
                singleLike.destroy!
            end
            render json: {success:true, message:"You disliked the post"}
        else
            render json: {success:false, message:"U can't Unlock"}
        end
    rescue => e
        render json: {success:false, message:"Like not destroyed"}
    end

end
