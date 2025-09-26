const express = require('express');
const router = express.Router();
const {
  getContactInfo,
  updateContactInfo,
  addSocialLink,
  removeSocialLink
} = require('../controllers/contactInfoController');
const { authenticate } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticate);

// Routes
router.route('/')
  .get(getContactInfo)      // GET /api/contact-info
  .put(updateContactInfo);  // PUT /api/contact-info

// Social media routes
router.route('/socials')
  .post(addSocialLink);     // POST /api/contact-info/socials

router.route('/socials/:socialId')
  .delete(removeSocialLink); // DELETE /api/contact-info/socials/:socialId

module.exports = router;


