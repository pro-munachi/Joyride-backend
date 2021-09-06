const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
})

module.exports = Role = mongoose.model('role', roleSchema)
