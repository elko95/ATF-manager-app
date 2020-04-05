const express = require("express");
const mongoose = require("mongoose");
const router = new express.Router();
const Table = require("../models/table");
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

// POST /tables ( create a new table)

router.post(
  "/tables",
  auth,
  userController.grantAccess("createAny", "table"),
  async (req, res) => {
    const table = new Table({ ...req.body });
    try {
      await table.save();
      res.status(201).send(table);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// GET /tables ( read all tables)

router.get(
  "/tables",
  auth,
  userController.grantAccess("readAny", "table"),
  async (req, res) => {
    try {
      const tables = await Table.find();
      res.send(tables);
    } catch (e) {
      res.status(500);
    }
  }
);

// // GET /tables/:id ( read a single table by its ID)

// router.get(
//   "/tables/:id",
//   auth,
//   userController.grantAccess("readAny", "table"),
//   async (req, res) => {
//     const _id = req.params.id;
//     const isValidId = mongoose.Types.ObjectId.isValid(_id);
//     if (!isValidId) {
//       return res.status(400).send("id is not valid");
//     }
//     try {
//       const table = await Table.findById(_id);
//       if (!table) {
//         return res.status(404).send();
//       }
//       res.send(table);
//     } catch (e) {
//       res.status(500).send();
//     }
//   }
// );

// GET  Table With Populate

router.get(
  "/tables/:id",
  auth,
  userController.grantAccess("readAny", "table"),
  async (req, res) => {
    try {
      const table = await Table.findOne({ _id: req.params.id });
      await table.populate("domaines").execPopulate();
      await table.populate("processus").execPopulate();

      res.send(table);
    } catch (e) {
      res.status(500).send();
    }
  }
);

// GET single Table  with nameT

router.get(
  "/table",
  auth,
  userController.grantAccess("readAny", "table"),
  async (req, res) => {
    try {
      const table = await Table.findOne({ nameT: req.query.nameT });
      await table.populate("domaines").execPopulate();
      await table.populate("processus").execPopulate();

      res.send(table);
    } catch (e) {
      res.status(500).send();
    }
  }
);

// PATCH /tables (update nameT or description of the table) [id]

router.patch(
  "/tables/:id",
  auth,
  userController.grantAccess("updateAny", "table"),
  async (req, res) => {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) {
      return res.status(400).send({ error: "invalid id" });
    }
    const updates = Object.keys(req.body);
    const allowedUpdates = ["nameT", "description"];
    const isValidOperation = updates.every(update => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: "invalid opertation" });
    }
    try {
      const table = await Table.findById(req.params.id);
      updates.forEach(update => (table[update] = req.body[update]));
      await table.save();
      // const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      //   new: true,
      //   runValidators: true
      // });
      if (!table) {
        return res.status(404).send({ error: "table not found" });
      }
      res.send(table);
    } catch (e) {
      res.status(400).send();
    }
  }
);

// PATCH /tables (update nameT or description of the table) [nameT]

router.patch(
  "/table",
  auth,
  userController.grantAccess("updateAny", "table"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["nameT", "description"];
    const isValidOperation = updates.every(update => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: "invalid opertation" });
    }
    try {
      const table = await Table.findOne({ nameT: req.query.nameT });
      updates.forEach(update => (table[update] = req.body[update]));
      await table.save();
      // const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      //   new: true,
      //   runValidators: true
      // });
      if (!table) {
        return res.status(404).send({ error: "table not found" });
      }
      res.send(table);
    } catch (e) {
      res.status(400).send();
    }
  }
);

// PATCH /addDomToTab ( add a domaine to a table ) [id]
router.patch(
  "/addDomToTables/:id",
  auth,
  userController.grantAccess("updateAny", "table"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["domaines"];
    const isValidOperation = updates.every(update => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: " invalid updates!" });
    }
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) {
      return res.status(400).send({ error: "invalid id" });
    }
    try {
      const table = await Table.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { domaines: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!table) {
        return res.status(404).send();
      }
      await table.save();
      res.send(table);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// PATCH /addDomToTab ( add a domaine to a table ) [nameT]

router.patch(
  "/addDomToTable",
  auth,
  userController.grantAccess("updateAny", "table"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["domaines"];
    const isValidOperation = updates.every(update => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: " invalid updates!" });
    }

    try {
      const table = await Table.findOneAndUpdate(
        { nameT: req.query.nameT },
        { $addToSet: { domaines: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!table) {
        return res.status(404).send();
      }
      await table.save();
      res.send(table);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// PATCH /addProcToTab ( add a processus to a table ) [id]

router.patch(
  "/addProcToTables/:id",
  auth,
  userController.grantAccess("updateAny", "table"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["processus"];
    const isValidOperation = updates.every(update => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: " invalid updates!" });
    }
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) {
      return res.status(400).send({ error: "invalid id" });
    }
    try {
      const table = await Table.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { processus: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!table) {
        return res.status(404).send();
      }
      await table.save();
      res.send(table);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);
// PATCH /addProcToTab ( add a processus to a table ) [nameT]

router.patch(
  "/addProcToTable",
  auth,
  userController.grantAccess("updateAny", "table"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["processus"];
    const isValidOperation = updates.every(update => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: " invalid updates!" });
    }

    try {
      const table = await Table.findOneAndUpdate(
        { nameT: req.query.nameT },
        { $addToSet: { processus: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!table) {
        return res.status(404).send();
      }
      await table.save();
      res.send(table);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// PATCH /removeDomFrmTab (remove a domaine from a table) [id]

router.patch(
  "/removeDomFrmTables/:id",
  auth,
  userController.grantAccess("updateAny", "table"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["domaines"];
    const isValidOperation = updates.every(update => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: " invalid updates!" });
    }
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) {
      return res.status(400).send({ error: "invalid id" });
    }
    try {
      const table = await Table.findByIdAndUpdate(
        req.params.id,
        { $pull: { domaines: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!table) {
        return res.status(404).send();
      }
      await table.save();
      res.send(table);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// PATCH /removeDomFrmTab (remove a domaine from a table) [nameT]

router.patch(
  "/removeDomFrmTable",
  auth,
  userController.grantAccess("updateAny", "table"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["domaines"];
    const isValidOperation = updates.every(update => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: " invalid updates!" });
    }

    try {
      const table = await Table.findOneAndUpdate(
        { nameT: req.query.nameT },
        { $pull: { domaines: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!table) {
        return res.status(404).send();
      }
      await table.save();
      res.send(table);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// PATCH /removeProcFrmTab (remove a processus from a table) [id]

router.patch(
  "/removeProcFrmTables/:id",
  auth,
  userController.grantAccess("updateAny", "table"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["processus"];
    const isValidOperation = updates.every(update => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: " invalid updates!" });
    }
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) {
      return res.status(400).send({ error: "invalid id" });
    }
    try {
      const table = await Table.findByIdAndUpdate(
        req.params.id,
        { $pull: { processus: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!table) {
        return res.status(404).send();
      }
      await table.save();
      res.send(table);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// PATCH /removeProcFrmTab (remove a processus from a table) [nameT]

router.patch(
  "/removeProcFrmTable",
  auth,
  userController.grantAccess("updateAny", "table"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["processus"];
    const isValidOperation = updates.every(update => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: " invalid updates!" });
    }

    try {
      const table = await Table.findOneAndUpdate(
        { nameT: req.query.nameT },
        { $pull: { processus: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!table) {
        return res.status(404).send();
      }
      await table.save();
      res.send(table);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// DELETE /tables ( delete a single table ) [id]

router.delete(
  "/tables/:id",
  auth,
  userController.grantAccess("deleteAny", "table"),
  async (req, res) => {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) {
      return res.status(400).send({ error: "invalid id" });
    }
    try {
      const tables = await Table.findByIdAndDelete(req.params.id);
      if (!tables) {
        return res.status(404).send({ error: "processus not found" });
      }
      res.send(tables);
    } catch (e) {
      res.status(500).send();
    }
  }
);

// DELETE /tables ( delete a single table ) [id]

router.delete(
  "/table",
  auth,
  userController.grantAccess("deleteAny", "table"),
  async (req, res) => {
    try {
      const tables = await Table.findOneAndDelete(req.query.nameT);
      if (!tables) {
        return res.status(404).send({ error: "processus not found" });
      }
      res.send(tables);
    } catch (e) {
      res.status(500).send();
    }
  }
);

module.exports = router;
