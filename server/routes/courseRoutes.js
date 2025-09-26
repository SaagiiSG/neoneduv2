const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { authenticate } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticate);

// Routes
router.route('/')
  .get(getAllCourses)    // GET /api/courses
  .post(createCourse);   // POST /api/courses

router.route('/:id')
  .get(getCourse)        // GET /api/courses/:id
  .put(updateCourse)     // PUT /api/courses/:id
  .delete(deleteCourse); // DELETE /api/courses/:id

module.exports = router;


