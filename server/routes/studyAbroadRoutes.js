const express = require('express');
const router = express.Router();
const {
  getAllStudyAbroadPrograms,
  getStudyAbroadProgram,
  createStudyAbroadProgram,
  updateStudyAbroadProgram,
  deleteStudyAbroadProgram
} = require('../controllers/studyAbroadController');
const { authenticate } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticate);

// Routes
router.route('/')
  .get(getAllStudyAbroadPrograms)    // GET /api/study-abroad
  .post(createStudyAbroadProgram);   // POST /api/study-abroad

router.route('/:id')
  .get(getStudyAbroadProgram)        // GET /api/study-abroad/:id
  .put(updateStudyAbroadProgram)     // PUT /api/study-abroad/:id
  .delete(deleteStudyAbroadProgram); // DELETE /api/study-abroad/:id

module.exports = router;


