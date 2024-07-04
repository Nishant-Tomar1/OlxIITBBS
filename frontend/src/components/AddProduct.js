import React, {useEffect, useState} from 'react'
import { useLoading } from '../store/contexts/LoadingContextProvider'
import { useAlert } from '../store/contexts/AlertContextProvider'
import { useNavigate, Link } from 'react-router-dom'
import BtnLoader from './loaders/BtnLoader'
import axios from 'axios'
import { Server } from '../Constants'
import { loginContext, useLogin } from '../store/contexts/LoginContextProvider'

function AddProduct() {
    const [newProduct , setNewProduct] = useState({
        title : "",
        description : "",
        category : "",
        price : "",
        ageInMonths : "",
      })

    const Navigate = useNavigate()
    const loginCtx = useLogin()
    const alertCtx = useAlert()
    const loadingCtx = useLoading()

    const handleNewProductChange = (e)=> {
        // console.log(e.target);
        setNewProduct(prev => ({
          ...prev,
          [e.target.name] : e.target.value
        }))
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        for (const key in newProduct){
            if(newProduct[key]==="" ){
              return alertCtx.setToast("warning", `${key} is required!`)
            }
        }
        if (newProduct.price < 50 || newProduct.price > 10000){
            return alertCtx.setToast("warning", `Price must be between 50 to 10000`)
        }
        if (newProduct.ageInMonths < 0 || newProduct.ageInMonths > 60){
            return alertCtx.setToast("warning", `Product Age must be between 0 to 60 months`)
        }
        const file1 = document.getElementById("thumbNail").files[0]
        const file2 = document.getElementById("extraImage").files[0]
        if (!file1 || !file2){
            return alertCtx.setToast("warning", `Both Images are required!`)
        }
        if (file1.name === file2.name){
            return alertCtx.setToast("warning","Both Images should be different")
        }
        console.log( file1);
        try {
            loadingCtx.setLoading(true)
            const formData = new FormData()
            for (const key in newProduct){
                formData.append(key, newProduct[key])
            }
            formData.append('thumbNail', file1);
            formData.append('extraImage', file2);
            const res = await axios.post(`${Server}/products/addproduct`,
                formData,
                {   
                    withCredentials : true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    
                }
            )
            console.log(res);
            if (res.data.statusCode === 200){
                alertCtx.setToast("success","Product Added Successfully")
                loadingCtx.setLoading(false)
                setNewProduct(prev => ({...prev,
                    title : "",
                    description : "",
                    category: "",
                    price : "",
                    ageInMonths : ""
                }))
            }
        } catch (error) {
            console.log(error);
            loadingCtx.setLoading(false)
            alertCtx.setToast("error","Something went wrong")
        }

    }

    useEffect(()=>{
        if (!loginCtx.isLoggedIn) return Navigate("/")
        window.scrollTo(0,0)
    },[loginCtx.isLoggedIn])

    return (
        <div  className="flex flex-col w-full pt-5 pb-12 items-center justify-center bg-gray-100 dark:bg-[#191919] dark:text-white">
            <h1 className="text-2xl lg:text-4xl font-bold font-[Raleway] pb-2">Add Product</h1>
        <form className=" mx-auto w-11/12 md:w-7/12 lg:w-5/12" onSubmit={handleSubmit}>
        <div className="mb-3">
            <label name="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Title</label>
            <input type="text" name="title" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500 " placeholder="Product Title" value={newProduct.title} onChange={handleNewProductChange} />
        </div>
        <div className="mb-3">
            <label name="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Description</label>
            <textarea type="text" name="description" maxLength="200" placeholder="Product description ( max 200 characters )" className="shadow-md bg-gray-50 border h-32 border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500 " value={newProduct.description} onChange={handleNewProductChange} />
        </div>
        <div className="mb-3">
            <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Select Category:</label>
            <select id="category" name="category" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500" onChange={handleNewProductChange} value={newProduct.category}>
                <option value="">Select Category</option>
                <option value="Electronics and Appliances">Electronics and Appliances</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Home and Furniture">Home and Furniture</option>
                <option value="Fashion and Beauty">Fashion and Beauty</option>
                <option value="Sports and Hobbies">Sports and Hobbies</option>
                <option value="Stationary">Stationary</option>
            </select>
        </div>
        
        <div className="mb-3">
            <label name="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Price (in Rupees)</label>
            <input type="number"  name="price" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500 " placeholder="Product Price" value={newProduct.price} onChange={handleNewProductChange} />
        </div>
        <div className="mb-3">
            <label name="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Product age (in months)</label>
            <input type="number" name="ageInMonths" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500 " placeholder="Product Price" value={newProduct.ageInMonths} onChange={handleNewProductChange} />
        </div>
        <div className="mb-3">        
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Primary Image</label>
          <input className="shadow-md block w-full text-md text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="thumbNail" type="file" accept="image/*" />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-300" id="file_input_help">PNG, JPG or JPEG.</p>
        </div>
        <div className="mb-3">        
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Secondary Image</label>
          <input className="shadow-md block w-full text-md text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="extraImage" type="file" accept="image/*" />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-300" id="file_input_help">PNG, JPG or JPEG.</p>
        </div>
        <button type="submit" className="w-full shadow-lg text-white bg-cyan-500 hover:bg-cyan-600  font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 ">{ loadingCtx.loading ? <BtnLoader /> : "Add Product" }</button>
        </form>
        </div>
    )
}

export default AddProduct
