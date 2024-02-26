import { useState } from "react"
import { useNavigate } from "react-router-dom"

const SignUp = () =>{
    const [name,setName] = useState('')
    const [password,setPassword] = useState('')
    const [email,setEmail] = useState('')

    const navigate = useNavigate()

    const collectData = async()=>{
        console.log(name,email,password);
        let result =await fetch("http://localhost:5000/register" , {
            method:'post',
            body:JSON.stringify({name,email,password}),
            headers:{
                'Content-Type':'application/json'
            },
        })
        result = await result.json()
        console.log('result', result)
        if(result){
            localStorage.setItem('user', JSON.stringify(result.result))
          localStorage.setItem('token', JSON.stringify(result.auth))
            navigate('/')
        }
    }       
    
    return(                         
        <>
        <div className="SignUp">
            <h2>Register</h2>
            <input className="inputBox" type="text" placeholder="Enter Name" value={name} onChange={(e)=>{setName(e.target.value)}} />
            <input className="inputBox" type="email" placeholder="Enter Email" value={email} onChange={(e)=>{setEmail(e.target.value)}} />
            <input className="inputBox" type="password" placeholder="Enter Password" value={password} onChange={(e)=>{setPassword(e.target.value)}} />
            <button className="signUpButton" type="button" onClick={collectData}>Sign Up</button>
        </div>

        </>
    )
}
                         
export default SignUp