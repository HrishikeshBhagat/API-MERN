import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProduct=()=>{
    const [name,setName] = useState('')
    const [price,setPrice] = useState('')
    const [category,setCategory] = useState('')
    const [company,setCompany] = useState('')
    const [message,setMessage] = useState('')
    const [error,setError] = useState(false)
    const params = useParams();
    const navigate = useNavigate()



    useEffect(()=>{
        getProductDetails()
    },[])

    const getProductDetails = async()=>{
        let result = await fetch(`http://localhost:5000/product/${params.id}`);
        result = await result.json()
        setName(result.name)
        setPrice(result.price)
        setCategory(result.category)
        setCompany(result.company)
    }

    const updateSelectedProduct= async()=>{         
        console.log(name,price,category,company)
        let result = await fetch(`http://localhost:5000/product/${params.id}`, {
            method:'put',
            body:JSON.stringify({name,price,category,company}),
            headers:{
                "Content-Type":"application/json",
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json()
        if (result){
            navigate('/')
        }
    }
    return(
        <>
        <div className="AddProduct">
        <h3 className="tac">Update Product </h3>
            <div className="SignUp">
                <input className="inputBox" type="text" placeholder="Product Name" 
                value={name} onChange={(e)=>{setName(e.target.value)}} />

                <input className="inputBox" type="text" placeholder="Product Price" 
                value={price} onChange={(e)=>{setPrice(e.target.value)}} />

                <input className="inputBox" type="text" placeholder="Product Category" 
                value={category} onChange={(e)=>{setCategory(e.target.value)}} />

                <input className="inputBox" type="text" placeholder="Product Company" 
                value={company} onChange={(e)=>{setCompany(e.target.value)}} />

                <button onClick={updateSelectedProduct} className="signUpButton" type="button" >Update Product</button>
            </div>
        </div>
        
        </>
    )
}

export default UpdateProduct;