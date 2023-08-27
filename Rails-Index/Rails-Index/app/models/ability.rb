# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)

    if user.has_role?(:admin)
      can :destroy_post, Post
      can :destroy_comment, Comment
      can :index, Post
      can :index, User
      can :update_status, User
      can :grab_user, User
      can :grab_post, User
      can :grab_all_posts,User
      can :upload, User
      can :grab_users_data, User
    end
  end
end
