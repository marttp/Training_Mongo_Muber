const assert = require("assert");
const request = require("supertest");
const app = require("../../app");

const mongoose = require("mongoose");
const Driver = mongoose.model("driver");

describe("Drivers controller", () => {
  it("POST to /api/drivers creates a new driver", done => {
    Driver.count().then(count => {
      request(app)
        .post("/api/drivers")
        .send({ email: "test@mail.com" })
        .end(() => {
          Driver.count().then(newCount => {
            assert(count + 1 === newCount);
            done();
          });
        });
    });
  });

  it("PUT to /api/drivers/id edits and existing driver", done => {
    const driver = new Driver({ email: "test1@mail.com", driving: false });
    driver.save().then(() => {
      request(app)
        .put(`/api/drivers/${driver._id}`)
        .send({ driving: true })
        .end(() => {
          Driver.findOne({ email: "test1@mail.com" }).then(driver => {
            assert(driver.driving === true);
            done();
          });
        });
    });
  });

  it("DELETE to /api/drivers/id can delete driver", done => {
    const driver = new Driver({ email: "test1@mail.com", driving: false });
    driver.save().then(() => {
      request(app)
        .delete(`/api/drivers/${driver._id}`)
        .end(() => {
          Driver.findOne({ email: "test1@mail.com" }).then(driver => {
            assert(driver === null);
            done();
          });
        });
    });
  });

  it("GET to /api/drivers finds drivers in a location", done => {
    const thanyaDriver = new Driver({
      email: "thanyadriver@mail.com",
      geometry: { type: "Point", coordinates: [100.73090314, 14.01874683] }
    });

    const universityDriver = new Driver({
      email: "universityDriver@mail.com",
      geometry: { type: "Point", coordinates: [100.72544683, 14.03590053] }
    });

    Promise.all([thanyaDriver.save(), universityDriver.save()]).then(() => {
      request(app)
        .get("/api/drivers?lng=100.72744683&lat=14.0254683")
        .end((err, response) => {
          assert(response.body.length === 2);
          assert(response.body[0].obj.email === "thanyadriver@mail.com");
          done();
        });
    });
  });
});
