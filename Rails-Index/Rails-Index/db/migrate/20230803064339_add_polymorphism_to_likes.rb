class AddPolymorphismToLikes < ActiveRecord::Migration[7.0]
  def change
    add_reference :likes, :entity, polymorphic: true, index: true
  end
end
