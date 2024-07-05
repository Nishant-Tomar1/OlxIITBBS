import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Carousel } from "flowbite-react";
import axios from 'axios';
import { Server } from '../Constants';
import { useAlert } from '../store/contexts/AlertContextProvider';
import { useLogin } from '../store/contexts/LoginContextProvider';
import { FaHeart, FaRegHeart, FaMessage } from "react-icons/fa6";
import { FaUserAlt } from 'react-icons/fa'
import { useCookies } from 'react-cookie';

function Product() {
    const [data, setData] = useState({
        product :{},
        owner : {}
    })
    const [userWishList, setUserWishList] = useState([])
    const dummy = [1,2,3,4]

    const [cookies] = useCookies(["accessToken", "refreshToken"])
    const {productId} = useParams()
    const loginCtx = useLogin()
    const alertCtx = useAlert()
    const Navigate = useNavigate()
    
    useEffect(()=>{
        fetchData()
        window.scrollTo(0,0)
    },[productId])

    const fetchData = async () => {
        try {
            const res = await axios.get(`${Server}/products/getproductbyid/${productId}`)
            // console.log(res.data);
            if (res.data.statusCode === 200){
                setData(prev => ({...prev,product:res.data.data.product, owner:res.data.data.owner}))
                if (cookies.accessToken){
					try {
						const res2 = await axios.get(`${Server}/users/currentuser-wishlist`, {withCredentials : true});
						// console.log(res2.data.data);
						setUserWishList(res2.data.data.map((wish) => wish.product[0]._id))
					} catch (error) {
						console.log(error);
					}
				}
				else setUserWishList([])
            }
            // console.log(res.data.data);
        } catch (error) {
            console.log(error);
            alertCtx.setToast("error","Something went wrong while fetching product data")
            Navigate("/")
        }
    }

    const handleWishChange = async (productId) => {
		if (loginCtx.isLoggedIn === false){
			return alertCtx.setToast("info","You are not logged In")
		}
		try {			
			if (userWishList.includes(productId)){
				setUserWishList(prev => prev.map((id) => ((id !== productId) ? id : null)))
				await axios.delete(`${Server}/products/deletewish/${productId}`,{withCredentials : true})
				// console.log(res);
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


    return (
        <div className="container px-5 py-6 lg:py-16 mx-auto text-gray-700 dark:text-white">
            <div className="w-11/12 lg:w-4/5 mx-auto flex flex-wrap text-gray-700 dark:text-white">
                <div className="lg:w-1/2 w-full lg:h-96 h-64 sm:h-80 object-cover object-center rounded-xl z-0">
                    {data.product.extraImage ? (
                        <Carousel>
                            <img src={`${data.product.thumbNail}`} alt="..." />
                            <img src={`${data.product.extraImage}`} alt="..." />
                        </Carousel>
                    ) : (
                        <img
                            className=" w-full lg:h-96 h-64 sm:h-80 object-cover object-center rounded-xl z-0"
                            src={`${data.product.thumbNail}`}
                        />
                    )}
                </div>
                <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                    <h2 className="text-sm title-font text-gray-500 tracking-wider">
                        {data.product.category}
                    </h2>
                    <h1 className="text-xl lg:text-4xl title-font mb-1 font-[Raleway] font-extrabold text-black dark:text-teal-400">
                        {data.product.title}
                    </h1>
                    <div className='max-h-32 lg:min-h-32 overflow-y-auto'>
                    <p className="font-normal text-lg text-gray-600 dark:text-gray-300">
                        {data.product.description}
                    </p>
                    </div>
                    <div className='my-1'> 
                    <span className="title-font font-extrabold text-3xl lg:text-5xl text-blue-500 tracking-wider ">
                            ₹ {Math.abs(data.product.price)}.00
                        </span>
                    </div>
                    

                    <div className="flex justify-between text-md lg:text-xl">
                        
                        <h4 className=' my-2'>
                        <span className=' font-bold text-orange-400'>Product age : </span>{data.product.ageInMonths} {data.product.ageInMonths ===1 ? "month" : "months"}
                        </h4>
                        <button
                            title={
                                userWishList.includes(data.product._id)
                                    ? "Remove from wishlist"
                                    : "Add to WishList"
                            }
                            onClick={() => {
                                handleWishChange(data.product._id);
                            }}
                            className="rounded-full p-1 flex justify-center text-red-500 items-center text-2xl "
                        >
                            {userWishList.includes(data.product._id) ? (
                                <FaHeart />
                            ) : (
                                <FaRegHeart />
                            )}
                        </button>
                    </div>

                    <div className="border-t-2 border-t-gray-700 dark:border-t-white mt-2 pt-3 ">
                        <div className="flex justify-between ">
                            <div className="flex items-center justify-center">
                                <img
                                    className="w-8 h-8 object-center object-cover mx-2 rounded-full"
                                    src={`${data.owner.profilePicture}`}
                                    alt="img"
                                 />    
                                <div className="flex-1">
                                    {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                                        seller
                                    </p> */}
                                    <p className="text-md lg:text-lg font-extrabold font-[Raleway] text-gray-900 dark:text-white">
                                        {data.owner.fullName} (Seller)
                                    </p>
                                </div>
                            </div>
                            {(data.owner._id !== loginCtx.userId) && <div className="flex gap-2 ">
                                <div title='Seller Profile' className='flex items-center justify-center pe-2 text-xl text-blue-500 cursor-pointer dark:text-gray-200'><FaUserAlt/></div>
                                <div onClick={() => { if(loginCtx.userId){Navigate(`/chats/${data.owner._id}/${loginCtx.userId}`)} else{alertCtx.setToast("info","You are not logged in")}}} title='Chat with seller' className='flex items-center justify-center pe-2 text-xl text-blue-500 cursor-pointer dark:text-gray-200'><FaMessage/></div>
                                {/* <div title='Call Owner' className='flex items-center justify-center pe-1 text-xl text-blue-500 cursor-pointer dark:text-gray-200'><FaPhone/></div> */}
                            </div>}
                        </div>
                    </div>
                </div>
            </div>

            {/* other products by owner */}
            <div className="container mt-10">
               {<div className="w-full text-center font-bold font-[Raleway] text-2xl lg:text-3xl pt-5">Other Products by this Seller</div>}
                    <div className="flex flex-wrap m-2 xl:m-2 justify-center items-center w-full ">
                    { (data.owner.productsAdded) ?
						( data.owner.productsAdded.map((product)=>(
                            
							(product._id !== data.product._id)&& (<div  key={product._id} className="p-2 md:w-1/2 xl:w-1/4 h-full">
								<div className="w-full bg-gray-100 dark:bg-[#252525] rounded-2xl lg:rounded-lg overflow-hidden shadow-lg p-3 lg:p-2">
									<img className="w-full md:h-40 lg:h-56  object-cover object-center rounded-md" src={`${product.thumbNail}`} alt="" />
									
									<div className="py-2 lg:px-2 flex flex-col justify-between h-1/2 w-full">
										<div className="flex flex-col">
											<h2 className=" text-xs font-[Outfit] text-gray-400">{product.category}</h2>
											<div className="flex justify-between ">
												<h1 className="title-font text-lg lg:text-lg font-bold  font-[Montserrat] text-gray-700 dark:text-gray-100 mb-1">{product.title}</h1>
												<h1 className="title-font
												text-lg lg:text-lg font-bold text-green-500 mb-1">₹ {product.price}</h1>
											</div>
											<p className="mb-3 lg:text-sm font-normal h-14 overflow-y-auto">{product.description.length > 80 ? (product.description.substr(0,80)+"...") : (product.description) }  </p>
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
							</div>)
						)))
							:
						( dummy.map(item => 
						<div key={item} role="status" className="p-2 md:w-1/2 lg:w-1/4 h-full w-5/6 animate-pulse">
							<div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
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
								<div>
									<div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
									<div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
								</div>
							</div>
							<span className="sr-only">Loading...</span>
						</div>))}
                </div>
            </div>
        </div>
    );
}

export default Product
