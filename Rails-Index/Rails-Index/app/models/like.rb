class Like < ApplicationRecord
    validates :user, uniqueness: {scope: [:entity_id, :entity_type]}
    belongs_to :user
    belongs_to :entity, :polymorphic => true
end
