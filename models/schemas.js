const {Schema, model} = require('mongoose');

const contact = new Schema({
        name: {
          type: String,
          required: [true, 'Set name for contact'],
        },
        email: {
          type: String,
        },
        phone: {
          type: String,
        },
        favorite: {
          type: Boolean,
          default: false,
        },
},{
  versionKey: false, // You should be aware of the outcome after set to false
  collection:process.env.CONTACTS_COLLECTION_NAME
});

const Contact = model('contact', contact);
module.exports = {Contact};