const express = require("express");
const mongoose = require("mongoose");
const router = new express.Router();
const Processus = require("../models/processus");
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

const proces = require("../controllers/processusController.js");
router.get(
  "/processus/table/:id",
  auth,
  proces.findByTableId,

  userController.grantAccess("readAny", "processus")
);

router.get(
  "/processus/domaine/:id",
  auth,
  proces.findByDomaineId,

  userController.grantAccess("readAny", "processus")
);

// POST /processus ( create a new processus)

router.post(
  "/processus",
  auth,
  userController.grantAccess("createAny", "processus"),
  async (req, res) => {
    const processus = new Processus({ ...req.body });

    try {
      await processus.save();
      res.status(201).send(processus);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// GET /processus  ( read all processus)

router.get(
  "/processus",
  auth,
  userController.grantAccess("readAny", "processus"),
  async (req, res) => {
    try {
      const processus = await Processus.find();
      res.send(processus);
    } catch (e) {
      res.status(500);
    }
  }
);

// // GET /processus/:id  ( read a single processus by its ID)

// router.get(
//   "/processus/:id",
//   auth,
//   userController.grantAccess("readAny", "processus"),
//   async (req, res) => {
//     const _id = req.params.id;
//     const isValidId = mongoose.Types.ObjectId.isValid(_id);
//     if (!isValidId) {
//       return res.status(400).send("id is not valid");
//     }
//     try {
//       const processus = await Processus.findById(_id);
//       if (!processus) {
//         return res.status(404).send();
//       }

//       res.send(processus);
//     } catch (e) {
//       res.status(500).send();
//     }
//   }
// );

// GET  processus With Populate [ID]

router.get(
  "/processus/:id",
  auth,
  userController.grantAccess("readAny", "processus"),
  async (req, res) => {
    try {
      const processus = await Processus.findOne({ _id: req.params.id });
      await processus.populate("tables").execPopulate();
      await processus.populate("domaines").execPopulate();

      res.send(processus);
    } catch (e) {
      res.status(500).send();
    }
  }
);

// PATCH /processus  (update name or description of the processus) [ID]

router.patch(
  "/processus/:id",
  auth,
  userController.grantAccess("updateAny", "processus"),
  async (req, res) => {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) {
      return res.status(400).send({ error: "invalid id" });
    }
    const updates = Object.keys(req.body);
    const allowedUpdates = ["nameP", "description"];
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: "invalid opertation" });
    }
    try {
      const processus = await Processus.findById(req.params.id);
      updates.forEach((update) => (processus[update] = req.body[update]));
      await processus.save();

      // const processus = await Processus.findByIdAndUpdate(
      //   req.params.id,
      //   req.body,
      //   {
      //     new: true,
      //     runValidators: true
      //   }
      // );
      if (!processus) {
        return res.status(404).send({ error: "processus not found" });
      }
      res.send(processus);
    } catch (e) {
      res.status(400).send();
    }
  }
);

// PATCH /addTabToProc ( add a table to processus ) [ID]

router.patch(
  "/addTabToProc/:id",
  auth,
  userController.grantAccess("updateAny", "processus"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["tables"];
    const isValidOperation = updates.every((update) => {
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
      const processus = await Processus.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { tables: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!processus) {
        return res.status(404).send();
      }
      await processus.save();
      res.send(processus);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// PATCH /addDomToProc ( add a domaine to processus ) [ID]

router.patch(
  "/addDomToProc/:id",
  auth,
  userController.grantAccess("updateAny", "processus"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["domaines"];
    const isValidOperation = updates.every((update) => {
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
      const processus = await Processus.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { domaines: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!processus) {
        return res.status(404).send();
      }
      await processus.save();
      res.send(processus);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// PATCH /removeTabFrmProc ( remove a table from processus ) [ID]

router.patch(
  "/removeTabFrmProc/:id",
  auth,
  userController.grantAccess("updateAny", "processus"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["tables"];
    const isValidOperation = updates.every((update) => {
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
      const processus = await Processus.findByIdAndUpdate(
        req.params.id,
        { $pull: { tables: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!processus) {
        return res.status(404).send();
      }
      await processus.save();
      res.send(processus);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// PATCH /removeDomFrmProc ( remove a domaine from processus ) [ID]

router.patch(
  "/removeDomFrmProc/:id",
  auth,
  userController.grantAccess("updateAny", "processus"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["domaines"];
    const isValidOperation = updates.every((update) => {
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
      const processus = await Processus.findByIdAndUpdate(
        req.params.id,
        { $pull: { domaines: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!processus) {
        return res.status(404).send();
      }
      await processus.save();
      res.send(processus);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// DELETE /processus [ID]

router.delete(
  "/processus/:id",
  auth,
  userController.grantAccess("deleteAny", "processus"),
  async (req, res) => {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) {
      return res.status(400).send({ error: "invalid id" });
    }
    try {
      const processus = await Processus.findByIdAndDelete(req.params.id);
      if (!processus) {
        return res.status(404).send({ error: "processus not found" });
      }
      res.send(processus);
    } catch (e) {
      res.status(500).send();
    }
  }
);

// les recherches suivantes sont faites selon le nom du processus

// GET  processus With Populate [nameP]

router.get(
  "/processusn",
  auth,
  userController.grantAccess("readAny", "processus"),
  async (req, res) => {
    try {
      const processus = await Processus.findOne({ nameP: req.query.nameP });
      await processus.populate("tables").execPopulate();
      await processus.populate("domaines").execPopulate();

      res.send(processus);
    } catch (e) {
      res.status(500).send();
    }
  }
);

// PATCH /processus  (update name or description of the processus) [nameP]

router.patch(
  "/processusn",
  auth,
  userController.grantAccess("updateAny", "processus"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["nameP", "description"];
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: "invalid opertation" });
    }
    try {
      const processus = await Processus.findOne(req.query.nameP);
      updates.forEach((update) => (processus[update] = req.body[update]));
      await processus.save();

      if (!processus) {
        return res.status(404).send({ error: "processus not found" });
      }
      res.send(processus);
    } catch (e) {
      res.status(400).send();
    }
  }
);

// PATCH /addTabToProc ( add a table to processus ) [nameP]

router.patch(
  "/addTabToProcessus",
  auth,
  userController.grantAccess("updateAny", "processus"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["tables"];
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: " invalid updates!" });
    }

    try {
      const processus = await Processus.findOneAndUpdate(
        { nameP: req.query.nameP },
        { $addToSet: { tables: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!processus) {
        return res.status(404).send();
      }
      await processus.save();
      res.send(processus);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// PATCH /addDomToProc ( add a domaine to processus ) [nameP]

router.patch(
  "/addDomToProcessus",
  auth,
  userController.grantAccess("updateAny", "processus"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["domaines"];
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: " invalid updates!" });
    }

    try {
      const processus = await Processus.findOneAndUpdate(
        { nameP: req.query.nameP },
        { $addToSet: { domaines: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!processus) {
        return res.status(404).send();
      }
      await processus.save();
      res.send(processus);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// PATCH /removeTabFrmProc ( remove a table from processus ) [nameP]

router.patch(
  "/removeTabFrmProcessus",
  auth,
  userController.grantAccess("updateAny", "processus"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["tables"];
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: " invalid updates!" });
    }

    try {
      const processus = await Processus.findOneAndUpdate(
        { nameP: req.query.nameP },
        { $pull: { tables: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!processus) {
        return res.status(404).send();
      }
      await processus.save();
      res.send(processus);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// PATCH /removeDomFrmProc ( remove a domaine from processus ) [nameP]

router.patch(
  "/removeDomFrmProcessus",
  auth,
  userController.grantAccess("updateAny", "processus"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["domaines"];
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: " invalid updates!" });
    }

    try {
      const processus = await Processus.findOneAndUpdate(
        { nameP: req.query.nameP },
        { $pull: { domaines: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!processus) {
        return res.status(404).send();
      }
      await processus.save();
      res.send(processus);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// DELETE /processus [nameP]

router.delete(
  "/processusn",
  auth,
  userController.grantAccess("deleteAny", "processus"),
  async (req, res) => {
    try {
      const processus = await Processus.findOneAndDelete(req.query.nameP);
      if (!processus) {
        return res.status(404).send({ error: "processus not found" });
      }
      res.send(processus);
    } catch (e) {
      res.status(500).send();
    }
  }
);

module.exports = router;
