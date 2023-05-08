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
        owner: {
          type: Schema.Types.ObjectId,
          ref: 'users',
        }
},{
  versionKey: false, // You should be aware of the outcome after set to false
  collection:process.env.CONTACTS_COLLECTION_NAME
});

const user = new Schema({
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: String
},{
  versionKey: false, // You should be aware of the outcome after set to false
  collection:process.env.USERS_COLLECTION_NAME
})

const Contact = model('contacts', contact);
const User = model('users', user);

module.exports = {Contact,User};