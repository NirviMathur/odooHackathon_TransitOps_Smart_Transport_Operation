const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");

// const { verifyToken } = require("../middleware/auth");
// router.use(verifyToken);

router.get("/", tripController.getTrips);
router.get("/available-vehicles", tripController.getAvailableVehicles);
router.get("/available-drivers", tripController.getAvailableDrivers);
router.post("/", tripController.createTrip);
router.patch("/:id/dispatch", tripController.dispatchTrip);
router.patch("/:id/complete", tripController.completeTrip);
router.patch("/:id/cancel", tripController.cancelTrip);

module.exports = router;
