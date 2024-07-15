import React,{useState, useEffect} from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { Server } from '../Constants';
import { useAlert } from '../store/contexts/AlertContextProvider';
import { useLogin } from '../store/contexts/LoginContextProvider';
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { PiEmptyBold } from 'react-icons/pi';


function UserProfile() {
  const {userId} = useParams();
  const [productList, setProductList] = useState([])
  const [isProductListEmpty, setProductListEmpty] = useState(false)
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    contactNumber: '',
    profilePicture: '',
    createdAt : '',
  });
  const [userWishList, setUserWishList] = useState([])
  const dummy = [1,2,3,4]

  const loginCtx = useLogin()
  const Navigate = useNavigate()
  const alertCtx  = useAlert()

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

  async function fetchData(){
    try {
        const res = (await axios.get(`${Server}/users/getuserbyId/${userId}`)).data.data
        // console.log(res);
        if (res.productsAdded.length === 0) setProductListEmpty(true)
        else setProductList(res.productsAdded)
      // console.log(res.productsAdded);
        setUser( prev => ({
            ...prev,
            username : res.username,
            firstName : res.fullName.split(" ")[0],
            lastName : res.fullName.split(" ")[1] || "",
            email : res.email,
            contactNumber: res.contactNumber,
            profilePicture : res.profilePicture,
            createdAt : new Date(res.createdAt).toLocaleDateString("en-IN",{month:"long",day:"numeric",year:"numeric"})
    }))
    } catch (error) {
        console.log(error);
    }
  }
  
  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
}, [Navigate, alertCtx]);

  return (
    
    <>
        <div className="bg-gray-100 dark:bg-[#191919] shadow-md flex flex-col w-full lg:flex-row justify-center lg:pt-3">
            <div className="flex flex-col items-center justify-center p-4 lg:pr-4 lg:w-1/3 py-3 lg:items-center ps-[10%]">
                {user.profilePicture && (
                    <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="text-center w-52 h-52 sm:w-64 sm:h-64 xl:w-72 xl:h-72 rounded-full my-4 object-cover object-center"
                    />
                )}
                {!user.profilePicture && (
                    <div className="flex text-center w-52 h-52 sm:w-64 sm:h-64 xl:w-72 xl:h-72 rounded-full my-4 justify-center items-center text-gray-700 dark:text-gray-200">
                        Loading..
                    </div>
                )}
                
            </div>

            <div className="flex flex-col lg:w-2/3 pt-5 pb-12 items-center justify-center dark:bg-[#191919] dark:text-white">
                <h1 className="text-2xl lg:text-4xl font-bold font-[Raleway] pb-2">
                    {user.firstName + " "+user.lastName}
                </h1>
                <div
                    className=" mx-auto w-11/12 md:w-5/6 lg:w-2/3"
                >
                    <div className="mb-3">
                        <label
                            name="username"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            readOnly
                            name="username"
                            className="shadow-md bg-gray-50 border border-gray-300 focus-ring-0 focus:outline-0 focus:border-0 text-gray-900 text-md rounded-lg block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white cursor-not-allowed"
                            placeholder="Enter Username"
                            value={user.username}
                        />
                    </div>
                    <div className="mb-3">
                        <label
                            name="email"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            autoComplete="off"
                            placeholder="Enter your email"
                            className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white cursor-not-allowed"
                            value={user.email}
                            readOnly
                        />
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                        <div className="mb-3 col-span-6">
                            <label
                                name="firstName"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"
                            >
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                autoComplete="off"
                                className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 cursor-not-allowed"
                                placeholder="Enter Firstname"
                                value={user.firstName}
                                readOnly
                            />
                        </div>
                        <div className="mb-3 col-span-6">
                            <label
                                name="lastName"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"
                            >
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                autoComplete="off"
                                className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white cursor-not-allowed"
                                placeholder="Enter Lastname"
                                value={user.lastName}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label
                            name="contactNumber"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"
                        >
                            Contact Number
                        </label>
                        <input
                            type="tel"
                            pattern="[6-9]{1}[0-9]{9}"
                            name="contactNumber"
                            className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white cursor-not-allowed"
                            placeholder="Enter Contact Number"
                            value={user.contactNumber}
                            readOnly
                        />
                    </div>
                    <div className="mb-3">
                        <label
                            name="Joined"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"
                        >
                            Joined
                        </label>
                        <input
                            type='text'
                            name="Joined"
                            className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white cursor-not-allowed"
                            placeholder="Enter Contact Number"
                            value={user.createdAt}
                            readOnly
                        />
                    </div>
                </div>
            </div>
        </div>
        
        <div className="flex flex-col w-full items-center bg-gray-100 dark:bg-[#191919] dark:text-white pb-4">
            <div className="w-full">
                {!isProductListEmpty && (
                    <div className="w-full text-center font-bold font-[Raleway] text-2xl lg:text-3xl ">
                        Products Owned by {user.firstName}
                    </div>
                )}
                <div className="flex flex-wrap my-2 justify-center items-center w-full ">
                    {!isProductListEmpty ? (
                        productList?.length > 0 ? (
                            productList.map((product) => (
                                <div
                                    key={product._id}
                                    className="p-2 my-1 md:my-0 w-11/12 md:w-1/2 xl:w-1/4 h-full"
                                >
                                    <div className="w-full bg-gray-100 dark:bg-[#252525] rounded-xl overflow-hidden shadow-lg p-3 lg:p-2">
                                        <img
                                            onClick={() => {Navigate(`/products/${product._id}`)}}
                                            className="cursor-pointer w-full md:h-40 lg:h-56  object-cover object-center rounded-lg"
                                            src={`${product.thumbNail}`}
                                            alt=""
                                        />

                                    <div className="py-2 lg:px-2 flex flex-col justify-between h-1/2 w-full">
										<div className="flex flex-col">
											<h2 className=" text-xs font-[Outfit] text-gray-400">{product.category}</h2>
											<div className="flex justify-between max-h-8 overflow-y-auto">
												<h1 onClick={()=>{Navigate(`/products/${product._id}`)}} className="cursor-pointer title-font text-xl lg:text-lg  font-bold  font-[Montserrat] text-gray-700 dark:text-gray-100 mb-1">{product.title}</h1>
												<h1 className="title-font
												text-lg lg:text-lg font-bold text-green-500 mb-1">{ product.status === "sold" ? (<span className="font-medium text-gray-400 dark:text-red-900">Sold</span>) : ("₹" + product.price) }</h1>
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
                            ))
                        ) : (
                            dummy.map((item) => (
                                <div
                                    key={item}
                                    role="status"
                                    className="p-2 md:w-1/2 lg:w-1/4 h-full w-5/6 animate-pulse"
                                >
                                    <div className="flex items-center justify-center h-64 md:h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                        <svg
                                            className="w-10 h-10 text-gray-200 dark:text-gray-600"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 16 20"
                                        >
                                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
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
                                </div>
                            ))
                        )
                    ) : (
                        <div className="flex flex-col lg:flex-row justify-center items-center w-full p-10 text-2xl lg:text-5xl gap-2">
                            <span className="text-5xl">
                                {" "}
                                <PiEmptyBold />
                            </span>
                            No Products added yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>

  );
}

export default UserProfile
