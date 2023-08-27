class UserController < AuthenticatorController
    require 'roo'
    protect_from_forgery with: :null_session
    before_action :authenticate_request, only: [:index, :update_status, :grab_user, :grab_post, :grab_all_posts, :upload, :grab_users_data]
    include JwtHelper

    def index
        if can?(:index, User)
            @users = User.with_role(:user)
            render json: {success:true, message: "All users fetched successfully.", data: @users}, status:200
        else
            render json: {success:false, message: "You are not admin."}, status:400
        end
    end

    def show
        s_user = User.find(params[:id])
        render json: {success:true, message: "User fetched successfully", data: s_user}, status: 200
    rescue => e 
        render json: {success:false, message: "Not found"}, status: 400
    end

    def grab_users_data
        if can?(:grab_users_data,User)
            @users = User.with_role(:user)
            heading_line = %w{name email phone_number}
            data = CSV.generate() do |csv|
                csv<<heading_line
                if @users.any?
                    @users.each do |user|
                        csv<< [user.name, user.email, user.phone_number]
                    end
                end
            end
            send_data data
        else
            render json:{success: false, message: "You are not authorized"}, status:400
        end
    end

    def grab_user
        if can?(:grab_user,User)
            @users = User.with_role(:user)
            heading_line = %w{Id Name Posts Comments Likes}
            data = CSV.generate() do |csv|
                csv<< heading_line
                if @users.any?
                    @users.each do |user|
                        csv<< [user.id, user.name, Post.where(user_id:user.id).count, Comment.where(user_id:user.id).count, Like.where(user_id:user.id).count]
                    end
                end    
            end
            send_data data
        else
            render json: { success: false, message: "You are not authorized."}, status:400
        end
    end

    def grab_post
        if can?(:grab_post,User)
            @users = User.with_role(:user).joins(:posts).group('users.id').having('COUNT(posts.id) > 10')
            heading_line = %w{Id Name Posts Comments Likes}
            data = CSV.generate() do |csv|
                csv<<heading_line
                if @users.any?
                    @users.each do |user|
                        csv<<[user.id, user.name, Post.where(user_id:user.id).count, Comment.where(user_id:user.id).count, Like.where(user_id:user.id).count]
                    end 
                end
            end
            send_data data
        else
            render json: {success: false, message:"You are not authorized"}, status:400
        end
    end

    def grab_all_posts
        if can?(:grab_all_posts,User)
            @posts = Post.all
            heading_line = %w{Id Title Description Comments Likes}
            data = CSV.generate() do |csv|
                csv<<heading_line
                if @posts.any?
                    @posts.each do |post|
                        csv<<[post.id, post.title, post.description, Comment.where(post_id:post.id).count, Like.where(entity_id:post.id,entity_type:"Post").count]
                    end
                end
            end
            send_data data
        else
            render json: {success:false, message:"You are not authorized." }
        end
    end


    def login
        l_user = User.find_by(email: params[:email])
        if l_user.status == 'deactive'
            render json:{success:false, message:"User is deactive. Please contact admin."},status:400
        elsif l_user && l_user.valid_password?(params[:password])

            payload = {user_id: l_user.id, email: l_user.email}

            jwt_token = generate_jwt_token(payload)
            

            render json: {success:true, message: "User Login Successful.", token: jwt_token ,data: l_user}, status: 200

        else
            render json: {success:false, message: "User doesn't exists. Please check the credentials."}, status: 400
        end
    end

    def create_user
        s_user = User.new
        s_user.name = params[:name]
        s_user.password = params[:password]
        s_user.email = params[:email]
        s_user.status = "active"
        s_user.phone_number = params[:phone_number]
        s_user.save!
        email_content = "<h1>Welcome to maze app.</h1><p>Have a greate time.</p>"
        UserNotifierMailer.send_signup_email(s_user,email_content).deliver_now
        render json: {success:true, message: "User created successfully"}, status: 200
        rescue => e
            render json: {success: false, message: e.message}, status: 400
    end

    def update_status
        if can?(:update_status, User)
            User.find(params[:id]).update(status: params[:status])
            render json: {success: true, message: "Status of user updated successfully."}, status:200
        else
            render json: {success: false, message: "Not updated."}, status:400
        end
    end

    def user_role
        u_user = User.find(params[:id])
        if u_user.has_role? (:admin)
            render json: {success:true},status:200
        else
            render json:{success:false}, status:400
        end
    end

    def upload
        if can?(:upload,User)
            if params[:file].respond_to?(:read)
                file_extension = File.extname(params[:file].original_filename).downcase

                if file_extension == '.csv'
                    csv_data = params[:file].read
                    csv_parsed = CSV.parse(csv_data, headers:true)

                    csv_parsed.each do |user|
                        user_data = {
                            name: user['name'],
                            email: user['email'],
                            phone_number: user['phone_number'],
                            status: 'active',
                            password: 'abcd@123'
                        }
                        User.create!(user_data)
                    end
                elsif file_extension == '.xlsx'
                    excel_data = params[:file].read
                    spreadsheet = Roo::Excelx.new(StringIO.new(excel_data))
                    header = spreadsheet.row(1)

                    (2..spreadsheet.last_row).each do |i|
                        row_data = Hash[[header,spreadsheet.row(i)].transpose]
                        phone_number = format('%.0f', row_data['phone_number'])
                        user_data = {
                            name: row_data['name'],
                            email: row_data['email'],
                            phone_number: phone_number,
                            status: 'active',
                            password: 'abcd@123'
                        }
                        User.create!(user_data)
                    end
                else
                    render json:{success:false, message:"File format not supported."},status:400
                end
                email_content = "<h1>File Upload successful.</h1><p>All the users mentioned in the file are successfully created.</p><p>Default password for all users : 'abcd@123' </p>"
                UserNotifierMailer.send_signup_email(@current_user,email_content).deliver_now
            else
                render json:{success:false, message:"No file is attached."}, status:400
            end
        else
            render json:{success:false, message:"You are not authorized."},status:400
        end
    end

end

