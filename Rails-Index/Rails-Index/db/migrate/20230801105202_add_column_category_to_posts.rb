class AddColumnCategoryToPosts < ActiveRecord::Migration[7.0]
  def change
    add_column :posts, :category, :string, null: false, default: ""
  end
end
