import { useState } from "react";

const AddProduct=()=>{
    const [name,setName] = useState('')
    const [price,setPrice] = useState('')
    const [category,setCategory] = useState('')
    const [company,setCompany] = useState('')
    const [message,setMessage] = useState('')
    const [error,setError] = useState(false)

    const addProduct= async()=>{
        if(!name || !price || !category || !company){
            setError(true)
            return false;
        }
        const userId = JSON.parse(localStorage.getItem('user'))._id
        let result = await fetch('http://localhost:5000/add-product',{
            method:'post',
            body: JSON.stringify({name,price,category,company,userId}),
            headers:{
                "Content-Type":"application/json",
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            },
            
            
        })
        result = await result.json()
        console.log(result)
        setMessage('Product added successfully.')
        setTimeout(()=>{
            [setMessage, setName, setPrice, setCategory, setCompany].forEach(setter => setter(''));
        },3000)          
        
    }
    return(
        <>
        <div className="AddProduct">
        <h3 className="tac">Add Product </h3>
        <p className="tac" style={{color:'green'}}>{message}</p>
            <div className="SignUp">
                <input className="inputBox" type="text" placeholder="Product Name" 
                value={name} onChange={(e)=>{setName(e.target.value)}} />
                { error && !name && <span style={{marginLeft:'9px', color:'crimson'}}>Enter product name </span> }
          
                <input className="inputBox" type="text" placeholder="Product Price" 
                value={price} onChange={(e)=>{setPrice(e.target.value)}} />
                {error && !price && <span style={{marginLeft:'9px',  color:'crimson'}}>Enter product price </span> }

                <input className="inputBox" type="text" placeholder="Product Category" 
                value={category} onChange={(e)=>{setCategory(e.target.value)}} />
                {error && !category && <span style={{marginLeft:'9px', color:'crimson'}}>Enter product category </span> }

                <input className="inputBox" type="text" placeholder="Product Company" 
                value={company} onChange={(e)=>{setCompany(e.target.value)}} />
                {error && !company && <span style={{marginLeft:'9px', color:'crimson'}}>Enter company name </span>}

                <button onClick={addProduct} className="signUpButton" type="button" >Add Product</button>
            </div>
        </div>
        
        </>
    )
}

export default AddProduct;