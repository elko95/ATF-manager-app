const Processus = require("../models/processus");

// Find all processuss containing a table
exports.findByTableId = (req, res) => {
  Processus.find({ tables: req.params.id }).exec(function (err, processus) {
    if (err) {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "No processus found with the given table " + req.params.id,
        });
      }
      return res.status(500).send({
        message:
          "Error retrieving processus with given table Id " + req.params.id,
      });
    }

    res.send(processus);
  });
};

// Find all processuss containing a domaine
exports.findByDomaineId = (req, res) => {
  Processus.find({ domaines: req.params.id }).exec(function (err, processus) {
    if (err) {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "No processus found with the given domaine " + req.params.id,
        });
      }
      return res.status(500).send({
        message:
          "Error retrieving processus with given domaine Id " + req.params.id,
      });
    }

    res.send(processus);
  });
};
