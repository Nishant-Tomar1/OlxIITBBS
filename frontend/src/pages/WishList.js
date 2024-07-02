import axios from "axios";
import React, { useEffect, useState } from "react";
import { Server } from "../Constants";

function WishList() {
    const [wishList, setWishList] = useState([])
    const fetchUserWishList = async() => {
        try {
            const res = await axios.get(`${Server}/users/currentuser-wishlist`,{withCredentials:true})
            const data = res.data.data.map(wish => wish.product);
            console.log(data);
            if (res.data.statusCode === 200){
                setWishList(data) 
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        fetchUserWishList()
    },[])
    return( 
        
        <div> 
            {wishList.map(productId => <div key={productId}>
            {productId}
        </div> )}
         </div>
);
}

export default WishList;
