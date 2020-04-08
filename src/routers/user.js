const express = require("express");
const mongoose = require("mongoose");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

// POST /users

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

//POST /users/login
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.matricule,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

//POST /users/logout

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//POST /users/logoutAll
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// GET /users/me
router.get(
  "/users/me",
  auth,
  userController.grantAccess("readOwn", "profile"),
  async (req, res) => {
    res.send(req.user);
  }
);

// GET /users
router.get(
  "/users",

  auth,
  userController.grantAccess("readAny", "profile"),
  async (req, res) => {
    try {
      const users = await User.find();
      res.send(users);
    } catch (e) {
      res.status(500);
    }
  }
);

// GET /users/:id

router.get(
  "/users/:id",

  auth,
  userController.grantAccess("readAny", "profile"),
  async (req, res) => {
    const _id = req.params.id;
    const isValidId = mongoose.Types.ObjectId.isValid(_id);
    if (!isValidId) {
      return res.status(400).send("id is not valid");
    }
    try {
      const user = await User.findById(_id);
      if (!user) {
        return res.status(404).send();
      }

      res.send(user);
    } catch (e) {
      res.status(500).send();
    }
  }
);

// GET /user?matricule=bcp123

router.get(
  "/user",
  auth,
  userController.grantAccess("readAny", "profile"),
  async (req, res) => {
    try {
      const user = await User.findOne({ matricule: req.query.matricule });
      if (!user) {
        return res.status(404).send();
      }

      res.send(user);
    } catch (e) {
      res.status(500).send();
    }
  }
);

// PATCH /user
router.patch(
  "/users/:id",
  auth,
  userController.grantAccess("updateAny", "profile"),
  async (req, res) => {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) {
      return res.status(400).send({ error: "invalid id" });
    }
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "nom",
      "prenom",
      "matricule",
      "email",
      "domaine",
      "role",
      "password",
    ];
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: "invalid opertation" });
    }
    try {
      const user = await User.findById(req.params.id);
      updates.forEach((update) => {
        user[update] = req.body[update];
      });
      await user.save();
      // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      //   new: true,
      //   runValidators: true
      // });
      if (!user) {
        return res.status(404).send({ error: "user not found" });
      }
      res.send(user);
    } catch (e) {
      res.status(400).send();
    }
  }
);

//DELETE /users

router.delete(
  "/users/:id",

  auth,
  userController.grantAccess("deleteAny", "profile"),
  async (req, res) => {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) {
      return res.status(400).send({ error: "invalid id" });
    }
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).send({ error: "user not found" });
      }
      res.send(user);
    } catch (e) {
      res.status(500).send();
    }
  }
);

// PATCH /user
router.patch(
  "/user",

  auth,
  userController.grantAccess("updateAny", "profile"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "nom",
      "prenom",
      "matricule",
      "email",
      "domaine",
      "role",
      "password",
    ];
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: "invalid opertation" });
    }
    try {
      const user = await User.findOne({ matricule: req.query.matricule });
      updates.forEach((update) => {
        user[update] = req.body[update];
      });
      await user.save();
      // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      //   new: true,
      //   runValidators: true
      // });
      if (!user) {
        return res.status(404).send({ error: "user not found" });
      }
      res.send(user);
    } catch (e) {
      res.status(400).send();
    }
  }
);

//DELETE /users

router.delete(
  "/user",

  auth,
  userController.grantAccess("deleteAny", "profile"),
  async (req, res) => {
    try {
      const user = await User.findOneAndDelete({
        matricule: req.query.matricule,
      });
      if (!user) {
        return res.status(404).send({ error: "user not found" });
      }
      res.send(user);
    } catch (e) {
      res.status(500).send();
    }
  }
);
module.exports = router;
