const mongoose = require("mongoose");
const domaineSchema = new mongoose.Schema({
  nameD: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    default: "Description manquante"
  },
  tables: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table"
    }
  ],
  processus: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Processus"
    }
  ]
});

const Domaine = mongoose.model("Domaine", domaineSchema);
module.exports = Domaine;
