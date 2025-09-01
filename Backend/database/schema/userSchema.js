const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  address: { type: String, trim: true },
  isAdmin: {
    default: false,
    type: Boolean
  },
  number: {
    type: String,
    validate: {
      validator: v => /^\d{10}$/.test(v),
      message: props => `${props.value} is not a valid 10-digit number!`
    }
  },
  cart: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }],
  orders: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['pending', 'cancelled', 'delivered'],
      default: 'pending'
    }
  }]
});

userSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('User', userSchema);
