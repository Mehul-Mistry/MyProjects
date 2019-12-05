const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');

const Order=require('../models/orders');
const Product =require('../models/product');

router.get('/',(req,res,next)=>{
    Order.find()
    .select('product quantity _id')
    .exec()
    .then(docs=>{
        const result = {
            count: docs.length,
            Orders: docs.map(doc=>{
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders' + doc._id
                    }
                }
            })
        }
        console.log(result);
        res.status(201).json(result);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.post('/',(req,res,next)=>{
    Product.findById(req.body.productId).then(product=>{
        if(!product)
        {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId 
        });
        return order.save();
    })
    .then(result=>{
        console.log(result);
        res.status(201).json(result);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.get('/:id',(req,res,next)=>{
    res.status(200).json({
        message: 'you discovered order ID',
        id: req.params.id
    });   
});

router.patch('/:id',(req,res,next)=>{
    res.status(200).json({
        message: 'updated product'
    });
});

router.delete('/:id',(req,res,next)=>{
    res.status(200).json({
        message: 'deleted order'
    });
});

module.exports=router;