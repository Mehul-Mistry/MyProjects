const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const multer=require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req,file,cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const upload=multer({storage: storage});

const Product = require('../models/product');

router.get('/',(req,res,next)=>{
    Product
    .find()
    .select('name price _id productImage')
    .exec()
    .then(doc=>
    { 
        const response={
            count: doc.length,
            products: doc.map(doc=>{
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    productImage: doc.productImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        }; 
        console.log(doc);
        res.status(200).json(response);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.post('/', upload.single('productImage'),(req,res,next)=>{
    console.log(req.file);
    const product =new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path 
    });

    product.save().then(result=>
        {
            console.log(result);
            res.status(200).json({
                message: 'handling post product request',
                createdProduct: product
            });
        }).catch(err=>{
            console.log(err);
            res.status(500).json({error : err});
        });

    
});

router.get('/:id',(req,res,next)=>{
    const id=req.params.id;
    Product.findById(id).exec().then(doc =>{
        console.log("From :"+doc);
        if(doc)
        {
            res.status(200).json(doc);
        }
        else{
            res.status(404).json({message: 'not found'})
        }
    }).catch(err=>{console.log(err);res.status(500).json({error: err})});
});

router.patch('/:id',(req,res,next)=>{
    var updateOps={};
    for(const ops of req.body)
    {
        updateOps[ops.propName] = ops.value; 
    }
    Product.update({_id: req.params.id}, { $set: updateOps }).exec().then(result=>{
        console.log(result);
        res.status(200).json(result);
    }).catch(err=>{console.log(err);res.status(500).json({error: err});});
});

router.delete('/:id',(req,res,next)=>{
    const id=req.params.id;
    Product.remove({_id: id}).exec().then(result=>{
        res.status(200).json(result);
    }).catch(err=>{
        console.log(err);
        res.status(500).json({error: err});
    });
});

module.exports=router;