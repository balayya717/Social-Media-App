class Post < ApplicationRecord
    validates :title, presence: true
    belongs_to :user 
    has_many :likes, :as => :entity, dependent: :destroy
    has_many :comments, dependent: :destroy
end
