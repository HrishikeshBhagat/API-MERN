import './App.css';
import Footer from './components/Footer';
import Nav from './components/Nav';
import { Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import PrivateComponent from './components/PrivateComponent';
import Login from './components/Login';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import UpdateProduct from './components/UpdateProduct';
import UserProfile from './components/UserProfile';
function App() {
  return (
    <>
    
    <Nav/>
    <Routes>
      <Route element={<PrivateComponent/>} >
        <Route path='/' element={<ProductList/>} />                                                              
        <Route path='/addProduct' element={<AddProduct/>} />
        <Route path='/update/:id' element={<UpdateProduct/>}/>
        <Route path='/logout' element={<h1>logout product</h1>}/>
        <Route path='/profile' element={<UserProfile/>}/>
      </Route>   
      
      <Route path='/SignUp' element={<SignUp/>} />
      <Route path='/login' element={<Login/>}/>
    </Routes>
    <Footer/>
    </>
    
  );
}                                

export default App;
