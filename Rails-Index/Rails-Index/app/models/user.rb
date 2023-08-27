class User < ApplicationRecord
  rolify

  after_create :assign_user_roles

  private
  def assign_user_roles
    if(self.email == 'meebalayya15@gmail.com')
      self.add_role(:admin)
    else
      self.add_role(:user)
    end
  end

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
    has_many :posts,dependent: :destroy
    has_many :comments, dependent: :destroy
    has_many :likes, dependent: :destroy

  validates :phone_number, presence: true, uniqueness: true, format: { with: /\A\d{10}\z/, message: "given is in invalid format." }



end
