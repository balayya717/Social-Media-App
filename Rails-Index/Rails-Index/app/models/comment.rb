class Comment < ApplicationRecord
    validates :content, presence: true
    belongs_to :user
    belongs_to :post
    has_many :likes, :as => :entity, dependent: :destroy
end
