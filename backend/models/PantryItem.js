const mongoose = require('mongoose');

const pantryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  expiryDate: { type: Date },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('PantryItem', pantryItemSchema);
db.pantryitems.insertMany([
    { name: "Milk", expiryDate: new Date(new Date().setDate(new Date().getDate() + 1)), owner: ObjectId("user_id_1") },
    { name: "Eggs", expiryDate: new Date(new Date().setDate(new Date().getDate() + 3)), owner: ObjectId("user_id_2") },
    { name: "Bread", expiryDate: new Date(new Date().setDate(new Date().getDate() - 2)), owner: ObjectId("user_id_1") } // expired
  ]);
  