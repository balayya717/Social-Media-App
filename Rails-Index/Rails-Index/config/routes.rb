Rails.application.routes.draw do
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  root "post#index"
  post "/login", to:"user#login"
  post "/sign_up", to: "user#create_user"
  post "/user", to: "user#show"
  get "/users/all", to: "user#index"
  put "/users/status", to:"user#update_status"
  get "/users/all_user_list", to:"user#grab_user"
  get "/users/users_list", to:"user#grab_post"
  get "/grab_all_posts", to:"user#grab_all_posts"
  post "/user/role", to:"user#user_role"
  post "/user/upload", to:"user#upload"
  get "/users/details", to:"user#grab_users_data"

  get "/post", to: "post#index"
  get "/post/:id", to:"post#show"
  post "/post/create_post", to:"post#create_post"
  put "/post/:id/update_post", to:"post#update_post"
  delete "/post/:id/delete_post", to:"post#destroy_post"

  get "/comments", to:"comment#index"
  get "/post/:id/comments", to:"comment#show"
  post "/post/:id/comments/create_comment", to:"comment#create_comment"
  put "/comments/:id/update_comment", to: "comment#update_comment"
  delete "/comments/:id/destroy_comment", to: "comment#destroy_comment"

  get "/likes", to:"like#index"
  post "/user/likes", to:"like#user_likes"
  get "/post/:id/likes", to:"like#show_like"
  post "/post/:id/like", to:"like#create_like"
  delete "/post/:id/dislike", to:"like#destroy_like"
end
