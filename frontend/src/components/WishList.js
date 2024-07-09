import axios from "axios";
import React, { useEffect, useState } from "react";
import { Server } from "../Constants";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { FaHeart, FaRegHeart , FaHeartCrack} from "react-icons/fa6";
import { useLogin } from "../store/contexts/LoginContextProvider";
import { useAlert } from "../store/contexts/AlertContextProvider";

function WishList() {
    const [wishList, setWishList] = useState([])
    const [isWishListEmpty, setIsWishListEmpty] = useState(false)
    const [userWishList, setUserWishList] = useState([])
    const dummy = [1,2,3,4]

    const loginCtx = useLogin()
    const [cookies] = useCookies(["accessToken", "refreshToken"])
    const Navigate = useNavigate()
	// const alertCtx = useAlert()

    const fetchUserWishList = async() => {
        try {
            const res = await axios.get(`${Server}/users/currentuser-wishlist`,{withCredentials:true})
            const data = res.data.data.map(wish => wish.product[0]);
			const res2 = await axios.get(`${Server}/users/currentuser-wishlist`, {withCredentials : true});
            setUserWishList(res2.data.data.map((wish) => wish.product[0]._id))
            // console.log(data);
            if (data.length === 0) setIsWishListEmpty(true);
            // console.log(res.data.data);
            if (res.data.statusCode === 200){
                setWishList(data) 
            }
        } catch (error) {
            console.log(error);
        }
    }
	
    useEffect(() => {
        if (!cookies.accessToken){
            Navigate("/")
        }
        else fetchUserWishList()
        // console.log(userWishList);
    },[loginCtx.isLoggedIn])

    const handleWishChange = async (productId) => {
		try {			
			if (userWishList.includes(productId)){
				setUserWishList(prev => prev.map((id) => ((id !== productId)?id : null)))
				await axios.delete(`${Server}/products/deletewish/${productId}`,{withCredentials : true})
				// console.log(res);
				// alertCtx.setToast("success","Product removed from Wishlist")
			}
			else {
				setUserWishList(prev => ([...prev, productId]))
				await axios.post(`${Server}/products/addwish/${productId}`,{},{withCredentials : true})
				// console.log(res);
			}
		} catch (error) {
			console.log(error);
		}		
	}

    return( 
        
        <div className="flex bg-gray-50 dark:bg-[#191919] dark:text-white w-full items-center justify-center pb-16 pt-6">
            <div className="container">
               {!isWishListEmpty && <div className="w-full text-center font-bold font-[Raleway] text-2xl lg:text-3xl pt-5">My WishList</div>}
                    <div className="flex flex-wrap my-2 justify-center items-center w-full ">
                    { !isWishListEmpty ? ((wishList.length > 0) ?
						( wishList?.map((product)=>(
							<div  key={product?._id} className="p-2 my-1 md:my-0 w-11/12 md:w-1/2 xl:w-1/4 h-full">
								<div className="min-w-full bg-gray-100 dark:bg-[#252525] rounded-xl  overflow-hidden shadow-lg p-3 lg:p-2">
									<img className="max-h-72  w-full lg:h-56 object-cover object-center rounded-lg" src={`${product?.thumbNail}`} alt="" />
									
									<div className="py-2 lg:px-2 flex flex-col justify-between h-1/2 w-full">
										<div className="flex flex-col">
											<h2 className=" text-xs font-[Outfit] text-gray-400">{product.category}</h2>
											<div className="flex justify-between ">
												<h1 className="title-font text-lg lg:text-lg font-bold  font-[Montserrat] text-gray-700 dark:text-gray-100 mb-1">{product.title}</h1>
												<h1 className="title-font
												text-lg lg:text-lg font-bold text-green-500 mb-1">₹ {product.price}</h1>
											</div>
											<p className="mb-3 lg:text-sm font-normal h-14 overflow-y-auto">{product.description.length > 65 ? (product.description.substr(0,65)+"...") : (product.description) }  </p>
										</div>
										<div className="flex items-center justify-between">
											<Link to={`/products/${product._id}`} className="text-teal-400 font-medium inline-flex items-center md:mb-2 lg:mb-0 " >Show More
												<svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
												<path d="M5 12h14"></path>
												<path d="M12 5l7 7-7 7"></path>
												</svg>
											</Link>
												<button onClick={()=>{handleWishChange(product._id)}} title={userWishList.includes(product._id) ?  "Remove from wishlist" : "Add to WishList"} className="rounded-3xl flex justify-center text-red-500 items-center text-2xl ">
                                                	{userWishList.includes(product._id) ? <FaHeart/> : <FaRegHeart />}
                                            	</button>
										</div>
									</div>
								</div>
							</div>
						)))
							:
						( dummy.map(item => 
						<div key={item} role="status" className="p-2 md:w-1/2 lg:w-1/4 h-full w-5/6 animate-pulse">
							<div className="flex items-center justify-center h-64 md:h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
								<svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
									<path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
									<path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
								</svg>
							</div>
							<div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
							<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
							<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
							<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
							<div className="flex items-center mt-4">
							{/* <svg className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
									<path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
								</svg> */}
								<div>
									<div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
									<div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
								</div>
							</div>
							<span className="sr-only">Loading...</span>
						</div>)))
                        : (<div className="flex flex-col lg:flex-row justify-center items-center w-full p-10 min-h-[80vh] text-2xl lg:text-5xl gap-2"><span className="text-5xl"> <FaHeartCrack/></span> WishList is Empty!</div>)}
                </div>
            </div>
        </div>
    );
}

export default WishList;
