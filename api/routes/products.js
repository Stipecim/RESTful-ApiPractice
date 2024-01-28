        //express
const express = require('express');
const router = express.Router();
//-----------------------------
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "uploads");
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype ==='image/png') {
        cb(null, true);
    }else {
        cb(null, false);    
    }
}
const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


const ProductsController = require('../controllers/products');


router.get('/', ProductsController.Producs_get_all);

router.post('/',checkAuth, upload.single('Image'), ProductsController.Products_create_product);

router.get('/:productID', ProductsController.Products_get_product);

router.patch('/:productID',checkAuth, ProductsController.Products_patch_product);

router.delete('/:productID', checkAuth, ProductsController.Products_delete_prodcut);

module.exports = router;


