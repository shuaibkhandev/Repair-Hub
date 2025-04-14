const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const controller = require('../controllers/Technician');

// Multer fields
const uploadFields = upload.fields([{ name: 'photo', maxCount: 1 }]);

router.post('/', uploadFields, controller.createTechnician);
router.get('/', controller.getAllTechnicians);
router.get('/:id', controller.getTechnicianById);
router.put('/edit/:id', uploadFields, controller.updateTechnician);
router.delete('/:id', controller.deleteTechnician);

module.exports = router;
