import React from 'react'
import logo from "../assets/images/logos/logo.png"
import { Link, useNavigate } from 'react-router-dom'
import { FaGithub, FaInstagram, FaLinkedin, FaPhone} from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";

function Footer() {
    const Navigate = useNavigate()
  return (
      <footer className="shadow bg-gray-200  dark:bg-[#151515] dark:text-white border-t">       
          <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
              <div className="md:flex md:justify-between">
                <div className="mb-6 md:mb-0">
                    <div onClick={()=>{Navigate("/");window.scrollTo(0,0)}} className="flex items-center justify-center">
                        <img src={logo} className="h-6 lg:h-10 me-3" alt="OlxIITBBS Logo" />
                        <span className="self-center text-md dark:text-gray-200 "> <span className='font-bold text-xl font-[Montserrat]'>OlxIITBBS </span ><span className='hidden lg:block text-sm text-gray-500 dark:text-gray-400'> Your online solution for buying and selling thing at IIT Bhubaneswar.</span> </span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-2">
                    <div>
                        {/* <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Categories</h2> */}
                        <ul className="text-gray-500 dark:text-gray-400 font-medium text-center">
                            <li className="mb-4">
                                <div className="text-xs md:text-sm">Fashion & Beauty</div>
                            </li>
                            <li className="mb-4">
                                <div className="text-xs md:text-sm">Sports & Hobbies</div>
                            </li>
                            <li>
                                <div className="text-xs md:text-sm">Home & Furniture</div>
                            </li>
                        </ul>
                    </div>
                    <div>
                        {/* <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white min-h-5"></h2> */}
                        <ul className="text-gray-500 dark:text-gray-400 font-medium text-center">
                            <li className="mb-4">
                                <div className="text-xs md:text-sm">Electronics & Appliances</div>
                            </li>
                            
                            <li className="mb-4">
                                <div className="text-xs md:text-sm ">Stationary</div>
                            </li>
                            <li>
                                <div className="text-xs md:text-sm">Vehicles</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <hr className=" border-gray-700 sm:mx-auto dark:border-gray-500 my-4" />

            <div className="sm:flex sm:items-center sm:justify-between">
                <div className="text-xs w-full text-gray-500 text-center md:text-start dark:text-gray-400 lg:ms-5">© 2024 <span className="hover:underline">OlxIITBBS</span>. All Rights Reserved.
                </div>
                <div className="flex mt-4 justify-center items-center sm:mt-0">
                    <Link to="https://github.com/nishant-tomar1" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ">
                        <FaGithub/>
                    </Link>
                    <Link to="https://www.linkedin.com/in/nishant-tomar-7694aa2aa/" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                        <FaLinkedin/>
                    </Link>
                    <Link to="https://instagram.com/myself_nishant" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                        <FaInstagram/>
                    </Link>
                    <Link to="mailto:nishanttomar910@gmail.com.com?subject=Enquiry" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5  text-xl">
                        <BiLogoGmail/>
                    </Link>
                    <Link to="tel:+918920481815" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5 lg:me-5">
                       <FaPhone/>
                    </Link>
                </div>
            </div>
          </div>
      </footer>
  )
}

export default Footer
