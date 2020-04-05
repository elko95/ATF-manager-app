const mongoose = require("mongoose");
const tableSchema = new mongoose.Schema({
  nameT: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    default: "Description manquante"
  },
  domaines: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Domaine"
    }
  ],
  processus: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Processus"
    }
  ]
});
const Table = mongoose.model("Table", tableSchema);

module.exports = Table;
