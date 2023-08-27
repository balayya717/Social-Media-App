class UserNotifierMailer < ApplicationMailer
    default from: 'bala.krishna@jarvis.consulting'
  
    def send_signup_email(user, email_content)
      @user = user
      mail(to: @user.email, subject: 'Account created successfully.') do |format|
        format.html { render html: email_content.html_safe }
        format.text { render plain: email_content }
      end
    end
  end
  