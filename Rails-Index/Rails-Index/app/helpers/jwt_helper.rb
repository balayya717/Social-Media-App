require 'jwt'

module JwtHelper

    def generate_jwt_token(payload)
      JWT.encode(payload, 'Neppalli@5407', 'HS256')
    end
  
    def decode_jwt_token(token)
      JWT.decode(token, 'Neppalli@5407', true, algorithm: 'HS256').first
    rescue JWT::DecodeError, JWT::VerificationError
      nil
    end
end

