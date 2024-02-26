const express = require('express')
require('./db/config')
const cors = require('cors')
const User = require('./db/User')
const Product =  require('./db/Product')
const PORT = 5000
const app = express()
const bcrypt = require('bcrypt');

const Jwt = require('jsonwebtoken')
const jwtKey = 'mern-cart';       


app.use(express.json())
app.use(cors())


app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Please provide username, email, and password" });
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered" });
        }
        const hashedPassword = await bcrypt.hash(password, 10); 
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword
        });

        const result = await user.save();
        Jwt.sign({result},jwtKey,{expiresIn:"2h"}, (err,token)=>{  
            if(err){
                res.send({result:'Something went wrong, Please try after sometime.'})
            }
            res.send({result, auth:token})
        })
    } catch (error) {
        console.error("Error in registration:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});



app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please provide both email and password' });
        }
        const user = await User.findOne({ email })
        // const user = await User.findOne({ email }).select("-password")
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(user && isMatch){
            Jwt.sign({user},jwtKey,{expiresIn:"2h"}, (err,token)=>{
                if(err){
                    res.send({result:'Something went wrong, Please try after sometime.'})
                }
                res.send({user, auth:token})
            })
        }
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }
                                      
    } catch (err) {      
        console.error(err.message);
        res.status(500).send('Server Error');
    }                                                   
});    
                                  
                                                                         
app.post('/add-product', verifyToken,  async(req,res)=>{
    let product = new Product(req.body)
    let result = await product.save()
    res.send(result)
})

app.get("/products",verifyToken, async(req,res)=>{
    let products = await Product.find();
    if(products.length > 0){
        res.send(products)
    }
    else{
        res.send({mgs:'No products found'})
    }
})

app.delete('/product/:id',verifyToken,  async(req,res)=>{
    try {
        const productId = req.params.id;
        const deletionResult = await Product.deleteOne({_id:productId})
        if (deletionResult.deletedCount === 1) {
                return res.status(200).json({ message: 'Product deleted successfully',productDeleted:deletionResult });
            } else {
                return res.status(404).json({ error: 'Product not found' });
            }
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})


app.get('/product/:id' , async(req,res)=>{
    try{
        const productId = req.params.id;
        let product = await Product.findById(productId)
    if(product) {
            return res.status(200).json(product);
        } else {
            return res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error retrieving product:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})


app.put('/product/:id' ,verifyToken, async(req,res)=>{
    try{
        const productId = req.params.id;
        let product = await Product.updateOne(
            {_id:productId},
            {
                $set:req.body
            }
        )

    if(product) {
            return res.status(200).json(product);
        } else {
            return res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error retrieving product:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get('/search/:key' ,verifyToken, async(req,res)=>{
    let product = await Product.find({
        '$or':[
            {name:{$regex:req.params.key}},
            {company:{$regex:req.params.key}},
            {category:{$regex:req.params.key}}
        ]
    })
    if(product){
        res.send(product)
    }
    else{
        res.send({msg:'No product found.'})
    }
})

function verifyToken(req,res,next){
    let token = req.headers['authorization']
    if(token){
        token = token.split(' ')[1]
        console.log(token)
        Jwt.verify(token, jwtKey, (err, valid)=>{
            if(err){
                res.status(401).send({result:"Please provide valid token"})
            }
            else{
                next() 
            }
        })
    }
    else{
        res.send({result:"Please add token with header"})
    }
}






app.get('/products-by-category', async (req, res) => {
    try {
        const productsByCategory = await Product.aggregate([
            {
                $group: {
                    _id: "$company",
                    products: {
                        $push: { name: "$name", price: "$price" }
                    }      
                    // product: { $addToSet: "$name" },
                    // price: { $addToSet: "$price" }
                }
            }
        ]);

        res.json(productsByCategory);
    } catch (error) {
        console.error("Error in aggregation:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
 
app.listen(PORT, ()=>{
    console.log(`running on PORT ${PORT}`)
})           