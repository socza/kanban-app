import { Router } from 'express';
import * as LaneController from '../controllers/lane.controller';

const router = new Router();

// Get all Lanes
router.route('/lanes').get(LaneController.getLanes);

// Add a new Lane
router.route('/lanes').post(LaneController.addLane);

// Edit lane
router.route('/lanes/:laneId').put(LaneController.editLane);

// Delete Lane
router.route('/lanes/:laneId').delete(LaneController.deleteLane);

export default router;