const DriverController = require("../controllers//drivers_controller");

module.exports = app => {
  app.get("/api", DriverController.greeting);

  // ! Driver
  app.post("/api/drivers", DriverController.create);
  app.put("/api/drivers/:id", DriverController.edit);
  app.delete("/api/drivers/:id", DriverController.delete);

  // ! Geo
  app.get("/api/drivers", DriverController.index);
};
