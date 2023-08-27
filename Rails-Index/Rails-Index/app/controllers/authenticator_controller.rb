class AuthenticatorController < ApplicationController

    require 'csv'
    require 'rails/all'

    include JwtHelper

    private
    def authenticate_request
        token = request.headers['Authorization']&.split(' ')&.last
        unless token
            render json: {error: 'Token is missing'}, status: :unauthorized
            return
        end

        begin 
            payload = decode_jwt_token(token)
            user_id = payload['user_id']
            @current_user = User.find(user_id)
        rescue JWT::DecodeError, JWT::VerificationError
            render json: {error: 'Token is Invalid'}, status: :unauthorized
            return
        rescue ActiveRecord::RecordNotFound
            render json: {error: 'User Not found'}, status: :unauthorized
            return 
        end
    end
end
