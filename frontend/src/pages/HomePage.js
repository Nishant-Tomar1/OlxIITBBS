import axios from "axios";
import { useParams } from "react-router-dom";
import React,{useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Server } from "../Constants";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart ,FaHeartCrack } from "react-icons/fa6";
import { useLogin } from "../store/contexts/LoginContextProvider";
import { useAlert } from "../store/contexts/AlertContextProvider";
import { useCookies } from "react-cookie";
import { useSearch } from "../store/contexts/SearchContextProvider";
const images = require.context("../assets/images",true);


function HomePage() {
	const [notfound, setNotfound] = useState(false)
	const [page, setPage] = useState(1);
	const [products, setProducts] = useState([])
	const [userWishList, setUserWishList] = useState([])
	const imageList = images.keys().map((key)=> images(key))
	const [limit, setLimit] = useState(8);

	const Navigate = useNavigate(); 
	const loginCtx = useLogin();
	const alertCtx = useAlert()
	const [cookies] = useCookies(["accessToken", "refreshToken"])
	const searchCtx = useSearch()
	const {category} = useParams()
	const dummy = [1,2,3,4,5,6,7,8]

	useEffect(() => {
		// searchCtx.clearSearch()
		setNotfound(false)		
		setProducts([])
		setPage(1)
		fetchData();
		// console.log("rendering");
	},[loginCtx.isLoggedIn, category, searchCtx.search]);

	const fetchData = async (pageIn) => {
		try {
			if(searchCtx.search) setLimit(24)
			let search = searchCtx.search
			if (category) {search = ""}
			const res = await axios.get(`${Server}/products/getproducts?search=${search ? search : ""}&category=${category ? category : ""}&page=${pageIn ? pageIn : 1}&limit=${limit}`);
			// console.log(res.data.data);
			if (res.data.statusCode === 200 ){
				if (products.length === 0) setProducts(res.data.data);
				else if (products.length > 0) {
					setProducts(prev => [...prev, ...res.data.data])
					if ((res.data.data.length === 0) && !searchCtx.search) alertCtx.setToast("info", "No more Products available!")
				}
				if ((res.data.data.length === 0) && (searchCtx.search) ) setNotfound(true)
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
							<div className="text-xs lg:text-md mt-2 font-medium text-gray-700 dark:text-gray-100 text-center">Electronics & Appliances</div>
						</div>
						<div onClick={()=>{Navigate("/products/categories/Vehicles")}} className="cursor-pointer flex flex-col justify-center items-center w-1/3 p-3">
							<img className="w-10 h-10 rounded-full" src={imageList[1]} alt="" />
							<div className="text-xs lg:text-md mt-2 font-medium text-gray-700 dark:text-gray-100 text-center">Vehicles</div>
						</div>
						<div onClick={()=>{Navigate("/products/categories/Home and Furniture")}} className="cursor-pointer flex flex-col justify-center items-center w-1/3 p-3">
							<img className="w-10 h-10 rounded-full" src={imageList[2]} alt="" />
							<div className="text-xs lg:text-md mt-2 font-medium text-gray-700 dark:text-gray-100 text-center">Home & Furniture</div>
						</div>
					</div>
					<div className="flex w-full h-full">	
						<div onClick={()=>{Navigate("/products/categories/Fashion and Beauty")}} className="cursor-pointer flex flex-col justify-center items-center w-1/3 p-3">
							<img className="w-10 h-10 rounded-full" src={imageList[3]} alt="" />
							<div className="text-xs lg:text-md mt-2 font-medium text-gray-700 dark:text-gray-100 text-center">Fashion and Beauty</div>
						</div>
						<div onClick={()=>{Navigate("/products/categories/Sports and Hobbies")}} className="cursor-pointer flex flex-col justify-center items-center w-1/3 p-3">
							<img className="w-10 h-10 rounded-full" src={imageList[4]} alt="" />
							<div className="text-xs lg:text-md mt-2 font-medium text-gray-700 dark:text-gray-100 text-center">Sports and Hobbies</div>
						</div>
						<div onClick={()=>{Navigate("/products/categories/Stationary")}} className="cursor-pointer flex flex-col justify-center items-center w-1/3 p-3">
							<img className="w-10 h-10 rounded-full" src={imageList[5]} alt="" />
							<div className="text-xs lg:text-md mt-2 font-medium text-gray-700 dark:text-gray-100 text-center">Stationary</div>
						</div>

					</div>
					
				</div>

				{/* Products */}
				<div className="container">
					{(notfound && searchCtx.search) && (<div className="flex flex-col lg:flex-row justify-center items-center w-full p-10 min-h-[60vh] text-2xl lg:text-5xl gap-2"><span className="text-5xl"> <FaHeartCrack/></span> No Products found!</div>)}
					{(!notfound)&&<div className="flex flex-wrap m-2 xl:m-2 justify-center items-center md:justify-start">
						{products.length > 0 ?
						( products.map((product)=>(
							 <div key={product._id} className="p-2 my-1 md:my-0 w-11/12 md:w-1/2 xl:w-1/4 h-full">
								<div className="min-w-full bg-gray-100 dark:bg-[#252525] rounded-2xl lg:rounded-lg overflow-hidden shadow-lg p-3 lg:p-2">
									<img className="max-h-72  w-full lg:h-56 object-cover object-center rounded-md" src={`${product.thumbNail}`} alt="" />
									
									<div className="py-2 lg:px-2 flex flex-col justify-between h-1/2 w-full">
										<div className="flex flex-col">
											<h2 className=" text-xs font-[Outfit] text-gray-400">{product.category}</h2>
											<div className="flex justify-between ">
												<h1 onClick={()=>{Navigate(`/products/${product._id}`)}} className="cursor-pointer title-font text-lg lg:text-lg font-bold  font-[Montserrat] text-gray-700 dark:text-gray-100 mb-1">{product.title}</h1>
												<h1 className="title-font
												text-lg lg:text-lg font-extrabold text-green-400 mb-1 tracking-wide">₹ {Math.abs(product.price)}</h1>
											</div>
											<p className="mb-3 text-sm lg:text-sm font-light md:font-normal h-14 overflow-y-auto">{product.description.length > 65 ? (product.description.substr(0,65)+"...") : (product.description) }  </p>
										</div>
										<div className="flex items-center justify-between">
											<Link to={`/products/${product._id}`} className="text-teal-400 hover:text-teal-500 font-medium inline-flex items-center md:mb-2 lg:mb-0 " >Show More
												<svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
												<path d="M5 12h14"></path>
												<path d="M12 5l7 7-7 7"></path>
												</svg>
											</Link>
												<button title={userWishList.includes(product._id) ?  "Remove from wishlist" : "Add to WishList"} onClick={()=>{handleWishChange(product._id)}} className="rounded-3xl flex justify-center text-red-500 hover:text-red-600 items-center text-2xl ">
                                                	{userWishList.includes(product._id) ? <FaHeart/> : <FaRegHeart />}
                                            	</button>
										</div>
									</div>
								</div>
							</div>
						)))
							:

						(!notfound && ( dummy.map(item => 
						<div key={item} role="status" className="p-2 md:w-1/2 mb-6 lg:mb-0 lg:w-1/4 h-full w-5/6 animate-pulse mt-4">
							<div className="flex items-center justify-center h-64 md:h-48 mb-4 bg-gray-300 rounded-xl dark:bg-gray-700">
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
						</div>)))}

					</div>}
				</div>

				{ (products.length>0) &&(!searchCtx.search)&& <div className="flex justify-center items-center font-semibold text-gray-700 dark:text-white pb-8">
					<button onClick={handleShowMore}> {  "Show More..."}</button>
				</div>}

		</div>
       
    </>);
}

export default HomePage;
