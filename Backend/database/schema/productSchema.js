const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const productSchema = new mongoose.Schema({
    name: String,
    brand: String,
    price: Number,
    description: String,
    category: String,
    image: {
        data: Buffer,
        contentType: String
    },
    isEnable: {
        default: false,
        type: Boolean
    },
});

productSchema.plugin(mongoosePaginate);
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
