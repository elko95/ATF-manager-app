const Domaine = require("../models/domaine");

// Find all domaines containing a table
exports.findByTableId = (req, res) => {
  Domaine.find({ tables: req.params.id }).exec(function (err, domaines) {
    if (err) {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "No Domaine found with the given table " + req.params.id,
        });
      }
      return res.status(500).send({
        message:
          "Error retrieving Domaine with given table Id " + req.params.id,
      });
    }

    res.send(domaines);
  });
};
