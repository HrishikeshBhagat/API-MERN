import { useEffect, useState } from "react";
const UserProfile=()=>{
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const storedUserDetails = localStorage.getItem('user');
                                                                                  
        if (storedUserDetails) {
            setUserDetails(JSON.parse(storedUserDetails));
        }
    }, []);

    return(
        <>                    
        {userDetails && (
                <div className="profile-container tac m-5">
                <h2>User Details -</h2>
                {userDetails ? (
                    <div className="user-details">
                        <div className="detail fs26">
                            <b className="label">Name:</b> {userDetails.name}
                        </div>
                        <div className="detail fs26">
                            <b className="label">Email:</b> {userDetails.email}
                        </div>                                          
                    </div>      
                ) : (
                    <p>No user details found.</p>                               
                )}
            </div>
            )}
        </>
    )
}


export default UserProfile;