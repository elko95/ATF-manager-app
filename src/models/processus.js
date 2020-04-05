const mongoose = require("mongoose");
const validator = require("validator");

const processusSchema = new mongoose.Schema({
  nameP: {
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
  domaines: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Domaine"
    }
  ]
});

const Processus = mongoose.model("Processus", processusSchema);

module.exports = Processus;
