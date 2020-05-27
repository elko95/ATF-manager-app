const express = require("express");
const mongoose = require("mongoose");
const router = new express.Router();
const Domaine = require("../models/domaine");
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

const domains = require("../controllers/domaineController.js");
router.get(
  "/domaines/table/:id",
  auth,
  domains.findByTableId,

  userController.grantAccess("readAny", "domaine")
);
// POST /domaines (Creat a new domaine)

router.post(
  "/domaines",
  auth,
  userController.grantAccess("createAny", "domaine"),
  async (req, res) => {
    const domaine = new Domaine({ ...req.body });
    try {
      await domaine.save();
      res.status(201).send(domaine);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// GET /domaines (read all domaines)

router.get(
  "/domaines",
  auth,
  userController.grantAccess("readAny", "domaine"),
  async (req, res) => {
    try {
      const domaines = await Domaine.find();
      res.send(domaines);
    } catch (e) {
      res.status(500);
    }
  }
);

// GET /domaines/:id ( read a single domaine )[ID]

// router.get(
//   "/domaines/:id",
//   auth,
//   userController.grantAccess("readAny", "domaine"),
//   async (req, res) => {
//     const _id = req.params.id;
//     const isValidId = mongoose.Types.ObjectId.isValid(_id);
//     if (!isValidId) {
//       return res.status(400).send("id is not valid");
//     }
//     try {
//       const domaine = await Domaine.findById(_id);
//       if (!domaine) {
//         return res.status(404).send();
//       }

//       res.send(domaine);
//     } catch (e) {
//       res.status(500).send();
//     }
//   }
// );

// GET  Domaine With Populate [ID]

router.get(
  "/domaines/:id",
  auth,
  userController.grantAccess("readAny", "domaine"),
  async (req, res) => {
    try {
      const domaine = await Domaine.findOne({ _id: req.params.id });
      await domaine.populate("tables").execPopulate();
      await domaine.populate("processus").execPopulate();
      res.send(domaine);
    } catch (e) {
      res.status(500).send();
    }
  }
);

// PATCH /domaines (update name or description of the domaine) [ID]

router.patch(
  "/domaines/:id",
  auth,
  userController.grantAccess("updateAny", "domaine"),
  async (req, res) => {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) {
      return res.status(400).send({ error: "invalid id" });
    }
    const updates = Object.keys(req.body);
    const allowedUpdates = ["nameD", "description"];
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: "invalid opertation" });
    }
    try {
      const domaine = await Domaine.findById(req.params.id);
      updates.forEach((update) => (domaine[update] = req.body[update]));
      await domaine.save();
      // const domaine = await Domaine.findByIdAndUpdate(req.params.id, req.body, {
      //   new: true,
      //   runValidators: true
      // });
      if (!domaine) {
        return res.status(404).send({ error: "domaine not found" });
      }
      res.send(domaine);
    } catch (e) {
      res.status(400).send();
    }
  }
);

// PATCH /addTabToDom ( add a table to a domaine ) [ID]

router.patch(
  "/addTabToDomaines/:id",
  auth,
  userController.grantAccess("updateAny", "domaine"),
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
      const domaine = await Domaine.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { tables: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!domaine) {
        return res.status(404).send();
      }
      await domaine.save();
      res.send(domaine);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// PATCH /addProcToDom ( add a table to a domaine ) [ID]

router.patch(
  "/addProcToDomaines/:id",
  auth,
  userController.grantAccess("updateAny", "domaine"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["processus"];
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
      const domaine = await Domaine.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { processus: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!domaine) {
        return res.status(404).send();
      }
      await domaine.save();
      res.send(domaine);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// PATCH /removeTabFrmDom (remove tables from  a domaine) [ID]

router.patch(
  "/removeTabFrmDomaines/:id",
  auth,
  userController.grantAccess("updateAny", "domaine"),
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
      const domaine = await Domaine.findByIdAndUpdate(
        req.params.id,
        { $pull: { tables: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!domaine) {
        return res.status(404).send();
      }
      await domaine.save();
      res.send(domaine);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// PATCH /removeProcFrmDom (remove tables from  a domaine) [ID]

router.patch(
  "/removeProcFrmDomaines/:id",
  auth,
  userController.grantAccess("updateAny", "domaine"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["processus"];
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
      const domaine = await Domaine.findByIdAndUpdate(
        req.params.id,
        { $pull: { processus: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!domaine) {
        return res.status(404).send();
      }
      await domaine.save();
      res.send(domaine);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// DELETE /domaines ( delete a single domaine ) [ID]

router.delete(
  "/domaines/:id",
  auth,
  userController.grantAccess("deleteAny", "domaine"),
  async (req, res) => {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) {
      return res.status(400).send({ error: "invalid id" });
    }
    try {
      const domaine = await Domaine.findByIdAndDelete(req.params.id);
      if (!domaine) {
        return res.status(404).send({ error: "domaine not found" });
      }
      res.send(domaine);
    } catch (e) {
      res.status(500).send();
    }
  }
);

// les recherches suivantes sont faites selon le nom du domaine

// GET  Domaine With Populate [name]

router.get(
  "/domaine",
  auth,
  userController.grantAccess("readAny", "domaine"),
  async (req, res) => {
    try {
      const domaine = await Domaine.findOne({ nameD: req.query.nameD });
      await domaine.populate("tables").execPopulate();
      await domaine.populate("processus").execPopulate();
      res.send(domaine);
    } catch (e) {
      res.status(500).send();
    }
  }
);

// PATCH /domaines (update name or description of the domaine) [name]

router.patch(
  "/domaines",
  auth,
  userController.grantAccess("updateAny", "domaine"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["nameD", "description"];
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: "invalid opertation" });
    }
    try {
      const domaine = await Domaine.findOne(req.query.nameD);
      updates.forEach((update) => (domaine[update] = req.body[update]));
      await domaine.save();
      // const domaine = await Domaine.findByIdAndUpdate(req.params.id, req.body, {
      //   new: true,
      //   runValidators: true
      // });
      if (!domaine) {
        return res.status(404).send({ error: "domaine not found" });
      }
      res.send(domaine);
    } catch (e) {
      res.status(400).send();
    }
  }
);

// PATCH /addTabToDom ( add a table to a domaine ) [nameD]

router.patch(
  "/addTabToDomaine",
  auth,
  userController.grantAccess("updateAny", "domaine"),
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
      const domaine = await Domaine.findOneAndUpdate(
        { nameD: req.query.nameD },
        { $addToSet: { tables: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!domaine) {
        return res.status(404).send();
      }
      await domaine.save();
      res.send(domaine);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// PATCH /addProcToDom ( add a table to a domaine )

router.patch(
  "/addProcToDomaine",
  auth,
  userController.grantAccess("updateAny", "domaine"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["processus"];
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: " invalid updates!" });
    }

    try {
      const domaine = await Domaine.findOneAndUpdate(
        { nameD: req.query.nameD },
        { $addToSet: { processus: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!domaine) {
        return res.status(404).send();
      }
      await domaine.save();
      res.send(domaine);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// PATCH /removeTabFrmDom (remove tables from  a domaine)[nameD]

router.patch(
  "/removeTabFrmDomaine",
  auth,
  userController.grantAccess("updateAny", "domaine"),
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
      const domaine = await Domaine.findOneAndUpdate(
        { nameD: req.query.nameD },
        { $pull: { tables: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!domaine) {
        return res.status(404).send();
      }
      await domaine.save();
      res.send(domaine);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// PATCH /removeProcFrmDom (remove tables from  a domaine)

router.patch(
  "/removeProcFrmDomaine",
  auth,
  userController.grantAccess("updateAny", "domaine"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["processus"];
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: " invalid updates!" });
    }

    try {
      const domaine = await Domaine.findOneAndUpdate(
        { nameD: req.query.nameD },
        { $pull: { processus: req.body[updates] } },
        { new: true, useFindAndModify: true }
      );

      if (!domaine) {
        return res.status(404).send();
      }
      await domaine.save();
      res.send(domaine);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// DELETE /domaine?nameD=someName ( delete a single domaine ) [nameD]

router.delete(
  "/domaine",
  auth,
  userController.grantAccess("deleteAny", "domaine"),
  async (req, res) => {
    try {
      const domaine = await Domaine.findOneAndDelete(req.query.nameD);
      if (!domaine) {
        return res.status(404).send({ error: "domaine not found" });
      }
      res.send(domaine);
    } catch (e) {
      res.status(500).send();
    }
  }
);

module.exports = router;
