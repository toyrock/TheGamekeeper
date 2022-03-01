const mongoose = require ('mongoose')

const gameSchema = mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    author: {
        // type object id
        type: mongoose.SchemaTypes.ObjectId,
        // reference to user model
        ref: "User",
        required: true,
      },
});

module.exports = mongoose.model('Game', gameSchema)