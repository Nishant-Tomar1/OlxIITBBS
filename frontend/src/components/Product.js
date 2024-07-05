import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Carousel } from "flowbite-react";
import axios from 'axios';
import { Server } from '../Constants';
import { useAlert } from '../store/contexts/AlertContextProvider';

function Product() {
    const [data, setData] = useState({
        product :{},
        owner : {}
    })

    const {productId} = useParams()
    const alertCtx = useAlert()
    const Navigate = useNavigate()
    
    useEffect(()=>{
        fetchData()
    },[])

    const fetchData = async () => {
        try {
            const res = await axios.get(`${Server}/products/getproductbyid/${productId}`)
            if (res.data.statusCode === 200){
                setData(prev => ({...prev,product:res.data.data.product, owner:res.data.data.owner}))
            }
            // console.log(res.data.data);
        } catch (error) {
            console.log(error);
            alertCtx.setToast("error","Something went wrong while fetching product data")
            Navigate("/")
        }
    }


    return (
        <div className="container px-5 py-6 lg:py-16 mx-auto">
            <div className="w-11/12 lg:w-4/5 mx-auto flex flex-wrap text-gray-700 dark:text-white">
                <div className="lg:w-1/2 w-full lg:h-auto h-64 sm:h-80 object-cover object-center rounded z-0 ">
                {data.product.extraImage ? <Carousel>
                        <img src={`${data.product.thumbNail}`} alt="..." />
                        <img src={`${data.product.extraImage}`} alt="..." />
                </Carousel>:
                <img className=" w-full lg:h-96 h-64 sm:h-80 object-cover object-center rounded" src={`${data.product.thumbNail}`}/>
                }
                </div>
                <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                    <h2 className="text-sm title-font text-gray-500 tracking-widest">{data.product.category}</h2>
                    <h1 className="text-3xl title-font font-medium mb-1">{data.product.title}</h1>
                    {/* <div className="flex mb-4">
                    <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200 space-x-2s">
                        <Link className="text-gray-500">
                    
                        </Link>
                        <Link className="text-gray-500">
                    
                        </Link>
                        <Link className="text-gray-500">
                        
                        </Link>
                    </span>
                    </div> */}
                    <p className="leading-relaxed">{data.product.description}</p>
                    <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                        <div className="flex">
                            <span className="mr-3">Color</span>
                            <button className="border-2 border-gray-300 rounded-full w-6 h-6 focus:outline-none"></button>
                            <button className="border-2 border-gray-300 ml-1 bg-gray-700 rounded-full w-6 h-6 focus:outline-none"></button>
                            <button className="border-2 border-gray-300 ml-1 bg-indigo-500 rounded-full w-6 h-6 focus:outline-none"></button>
                        </div>
                    </div>
                    <div className="flex">
                        <span className="title-font font-medium text-2xl text-gray-900">$58.00</span>
                        <button className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Button</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Product
