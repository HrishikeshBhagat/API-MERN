import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(3); 

    const getProducts = async () => {
        try {
            let result = await fetch('http://localhost:5000/products', {
                headers: {
                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });
            if (result.ok) {
                result = await result.json();
                setProducts(result);
            } else {
                throw new Error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const deleteProduct = async(productId)=>{
        let result = await fetch(`http://localhost:5000/product/${productId}`, {
            method:'Delete',
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        result = await result.json()
        if(result){
            getProducts()
        }
    }

    const searchHandle= async(event)=>{
        let key = event.target.value
        if(key){
        let result = await fetch(`http://localhost:5000/search/${key}` , {
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        result =  await result.json()
        setProducts(result)

        }
        else{
            getProducts()
        }
    }
    return (
        <>
        <input className="searchBox" type="text" name="" id="" placeholder="&#128269; Search product" onChange={searchHandle}/>
        {products.length>0 ?
        <>
        <table className="table m-5">
            <thead>
                <tr>
                    <th scope="col">Sr no</th>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Category</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                {currentItems.map((product, index) => (
                    <tr key={index}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.category}</td>
                        <td>
                            <button className="borderNone text-danger fs26 bgWhite" onClick={()=>{deleteProduct(product._id)}}>&#128465;</button>
                            <Link className="tdn ml22" to={`/update/${product._id}`} target="_blank">Update</Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        <nav>
            <ul className="pagination" style={{justifyContent:'right', marginRight:'22px'}}>
                {Array.from({ length: Math.ceil(products.length / itemsPerPage) }).map((_, index) => (
                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                        <button onClick={() => paginate(index + 1)} className="page-link">
                            {index + 1}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
        </>
        :
        <div className="m-5">No products found.</div>
        }
        
        </> 
    );
};

export default ProductList;
