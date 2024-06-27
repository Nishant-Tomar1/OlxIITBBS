import axios from "axios";
import { useParams } from "react-router-dom";
import React,{useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Server } from "../Constants";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { useLogin } from "../store/contexts/LoginContextProvider";
import { useAlert } from "../store/contexts/AlertContextProvider";
import { useLoading } from "../store/contexts/LoadingContextProvider";
import BtnLoader from "../components/loaders/BtnLoader";
const images = require.context("../assets/images",true);


function HomePage() {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(2);
	const [products, setProducts] = useState([])
	const [userWishList, setUserWishList] = useState([])
	const imageList = images.keys().map((key)=> images(key))

	const Navigate = useNavigate(); 
	const loginCtx = useLogin();
	const alertCtx = useAlert()
	const loadingCtx = useLoading()
	const {category} = useParams()
	

	useEffect(() => {
		setProducts([])
		setPage(1)
		fetchData();
		// console.log("rendering");
	},[loginCtx.isLoggedIn, category]);

	const fetchData = async (pageIn) => {
		try {
			const res = await axios.get(`${Server}/products/getproducts?category=${category ? category : ""}&page=${pageIn ? pageIn : 1}&limit=${limit}`);
			// console.log(res.data);
			if (res.data.statusCode === 200 ){
				if (products.length === 0) setProducts(res.data.data);
				else if (products.length > 0) setProducts(prev => [...prev, ...res.data.data])
				if (loginCtx.isLoggedIn === true){
					try {
						const res2 = await axios.get(`${Server}/users/currentuser-wishlist`, {withCredentials : true});
						setUserWishList(res2.data.data.map((wish) => wish.product))
					} catch (error) {
						console.log(error);
					}
				}
				else setUserWishList([])
			}
		} catch (error) {
			console.log(error);
		}
	}

	const handleWishChange = async (productId) => {
		if (loginCtx.isLoggedIn === false){
			return alertCtx.setToast("info","You are not logged In")
		}
		try {			
			if (userWishList.includes(productId)){
				setUserWishList(prev => prev.map((id) => ((id !== productId)?id : null)))
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

	const handleShowMore = () => {
		setPage(prev => prev+1)
		fetchData(page+1)
	}

    return (
		<>
        <div className="flex flex-col w-full items-center bg-gray-50 dark:bg-[#191919] dark:text-white">

				{/* Categories */}
				<div className="flex flex-col lg:flex-row w-full items-center py-3 shadow">
					<div className="flex w-full h-full">
						<div onClick={()=>{Navigate("/products/categories/Electronics and Appliances")}} className="cursor-pointer flex flex-col justify-center items-center w-1/3 p-3">
							<img className="w-10 h-10 rounded-full" src={imageList[0]} alt="" />
							<div className="text-sm lg:text-md mt-2 font-medium text-gray-700 dark:text-gray-100 text-center">Electronics & Appliances</div>
						</div>
						<div onClick={()=>{Navigate("/products/categories/Vehicles")}} className="cursor-pointer flex flex-col justify-center items-center w-1/3 p-3">
							<img className="w-10 h-10 rounded-full" src={imageList[1]} alt="" />
							<div className="text-sm lg:text-md mt-2 font-medium text-gray-700 dark:text-gray-100 text-center">Vehicles</div>
						</div>
						<div onClick={()=>{Navigate("/products/categories/Home and Furniture")}} className="cursor-pointer flex flex-col justify-center items-center w-1/3 p-3">
							<img className="w-10 h-10 rounded-full" src={imageList[2]} alt="" />
							<div className="text-sm lg:text-md mt-2 font-medium text-gray-700 dark:text-gray-100 text-center">Home & Furniture</div>
						</div>
					</div>
					<div className="flex w-full h-full">	
						<div onClick={()=>{Navigate("/products/categories/Fashion and Beauty")}} className="cursor-pointer flex flex-col justify-center items-center w-1/3 p-3">
							<img className="w-10 h-10 rounded-full" src={imageList[3]} alt="" />
							<div className="text-sm lg:text-md mt-2 font-medium text-gray-700 dark:text-gray-100 text-center">Fashion and Beauty</div>
						</div>
						<div onClick={()=>{Navigate("/products/categories/Sports and Hobbies")}} className="cursor-pointer flex flex-col justify-center items-center w-1/3 p-3">
							<img className="w-10 h-10 rounded-full" src={imageList[4]} alt="" />
							<div className="text-sm lg:text-md mt-2 font-medium text-gray-700 dark:text-gray-100 text-center">Sports and Hobbies</div>
						</div>
						<div onClick={()=>{Navigate("/products/categories/Stationary")}} className="cursor-pointer flex flex-col justify-center items-center w-1/3 p-3">
							<img className="w-10 h-10 rounded-full" src={imageList[5]} alt="" />
							<div className="text-sm lg:text-md mt-2 font-medium text-gray-700 dark:text-gray-100 text-center">Stationary</div>
						</div>

					</div>
					
				</div>

				{/* Products */}
				<div className="container mx-auto">
					<div className="flex flex-wrap m-2 lg:m-4 justify-center md:justify-start items-center">
						{ products.map((product)=>(
							<div  key={product._id} className="p-2 md:w-1/2 lg:w-1/4 h-full">
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
											<p className="mb-3 lg:text-sm font-normal h-14 overflow-y-auto">{product.description}  </p>
										</div>
										<div className="flex items-center justify-between">
											<Link to={`/products/${product._id}`} className="text-teal-400 font-medium inline-flex items-center md:mb-2 lg:mb-0 " >Show More
												<svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
												<path d="M5 12h14"></path>
												<path d="M12 5l7 7-7 7"></path>
												</svg>
											</Link>
												<button onClick={()=>{handleWishChange(product._id)}} className="rounded-3xl flex justify-center text-red-500 items-center text-2xl ">
                                                	{userWishList.includes(product._id) ? <FaHeart/> : <FaRegHeart />}
                                            	</button>
										</div>
									</div>
								</div>
							</div>
						))
							}
					</div>
				</div>

				<div className="flex justify-center items-center font-semibold">
					<button onClick={handleShowMore}> {  "Show More..."}</button>
				</div>

		</div>
       
    </>);
}

export default HomePage;
