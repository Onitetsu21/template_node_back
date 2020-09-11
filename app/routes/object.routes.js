module.exports = app => {
    const objects = require("../controllers/object.controller.js");

    var router = require("express").Router();

    router.post("/", objects.create);

    router.get("/:objectId", objects.findAll);

    router.get("/:id", objects.findOne);

    router.put("/:id", objects.update);

    router.delete("/:id", objects.delete);

    app.use("/api/objects", router);
}