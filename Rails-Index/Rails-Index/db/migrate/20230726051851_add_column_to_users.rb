class AddColumnToUsers < ActiveRecord::Migration[7.0]
  def change
    # t.string :email,              null: false, default: ""
    add_column :users, :email, :string, null: false, default: ""
  end
end
