class AddIndexToEntityInLikes < ActiveRecord::Migration[7.0]
  def up
    add_index :likes, [:user_id, :entity_type, :entity_id], unique: true, name: "index_likes_on_entity_user" unless index_exists?(:likes, "index_likes_on_entity_user")
  end
  def down
    remove_index :likes, name: "index_likes_on_entity_user" if index_name_exists?(:likes, "index_likes_on_entity_user")
  end
end
