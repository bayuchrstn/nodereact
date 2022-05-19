var express = require("express");
var router = express.Router();
const uploadMiddleware = require("../middleware/upload");

const  { 
    getAllSetting,
    getSettings,
    getSetting,
    createSetting,
    updateSetting,
    deleteSetting,
    upload
} = require('../controllers/General.js')

router.post("/upload", uploadMiddleware.single("file"), upload);
router.get('/', getSettings)
router.get('/:id', getSetting)
router.post('/', createSetting) 
router.put('/:id', updateSetting)
router.delete('/:id', deleteSetting)

module.exports = router