import React, { useState } from "react";
import axios from "axios";
import { useLogin } from "../store/contexts/LoginContextProvider";
import { useLoading } from "../store/contexts/LoadingContextProvider";
import { useNavigate, Link } from "react-router-dom";
import { Server } from "../Constants";
import { useAlert } from "../store/contexts/AlertContextProvider";
import BtnLoader from "../components/loaders/BtnLoader";

function Login() {
    const [user, SetUser] = useState({
        username: "",
        email: "",
        password: "",
    });
    const Navigate = useNavigate();
    const alertCtx = useAlert();
    const loadingCtx = useLoading();

    const { isLoggedIn, fullName, login, logout } = useLogin();

    const handleUserChange = (e) => {
        const { name, value } = e.target;

        SetUser((user) => ({
            ...user,
            [name]: value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (user.username === "" && user.email === "") {
            return alertCtx.setToast(
                "warning",
                "Enter either username or email"
            );
        }

        try {
            loadingCtx.setLoading(true);
            const response = await axios.post(
                "http://localhost:8000/api/v1/users/login",
                user
            );
            const user2 = response.data.data.user;

            if (user2) {
                login(
                    response.data.data.accessToken,
                    response.data.data.refreshToken,
                    String(user2._id),
                    user2.fullName
                );
            }

            if (response.data.success) {
                loadingCtx.setLoading(false);
                alertCtx.setToast("success", `${response.data.message} `);
            }
        } catch (error) {
            loadingCtx.setLoading(false);
            alertCtx.setToast(
                "error",
                `Incorrect ${!user.username ? "Email" : "Username"} or Password`
            );
        }
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        loadingCtx.setLoading(true);
        try {
            await axios.post(
                `${Server}/users/logout`,
                {},
                { withCredentials: true }
            );
            setTimeout(() => {
                logout();
                alertCtx.setToast("success", "User Logged Out Successfully");
                loadingCtx.setLoading(false);
            }, 1000);
        } catch (error) {
            console.log(error);
            loadingCtx.setLoading(false);
            alertCtx.setToast(
                "error",
                "Cannot Logout User! Something went wrong"
            );
        }
    };

    const handleBtn = (e) => {
        e.target.name === "go home" ? Navigate("/") : Navigate("/signup");
    };

    const handleProfile = (e) => {
        e.preventDefault();
        Navigate("/profile");
    };

    return (
        <div className="flex flex-col items-center justify-center dark:text-white dark:bg-gray-700 w-full ">
            <h1 className="text-xl">
                {isLoggedIn ? "Login Another Account" : "Login"}
            </h1>
            <form action="" onSubmit={handleLogin}>
                <label htmlFor="">Username : </label>
                <input
                    onChange={handleUserChange}
                    className="dark:bg-gray-700 rounded-lg"
                    name="username"
                    type="text"
                    placeholder="username"
                    value={user.username}
                />
                <br />
                <label htmlFor="">Email : </label>
                <input
                    type="text"
                    name="email"
                    className="dark:bg-gray-700 rounded-lg"
                    placeholder="email"
                    onChange={handleUserChange}
                    value={user.email}
                />
                <br />
                <label htmlFor="">Password :</label>
                <input
                    required
                    className="dark:bg-gray-700 rounded-lg"
                    type="password"
                    name="password"
                    placeholder="password"
                    onChange={handleUserChange}
                    value={user.password}
                />{" "}
                <br />
                <button
                    type="submit"
                    className="bg-blue-600 px-3 py-2 rounded-lg m-2 min-w-[100px]"
                >
                    {loadingCtx.loading ? <BtnLoader /> : "Login"}
                </button>
                <Link
                    to="/forgotpassword"
                    className="text-blue-600 underline m-2"
                >
                    forgot password ?
                </Link>
            </form>
            <div className="my-10">
                <h1>
                    UserLoggidIn : {isLoggedIn ? `Yes` : "No"}{" "}
                    <p>fullName :{fullName}</p>
                </h1>
                {isLoggedIn && (
                    <button
                        className="bg-blue-600 px-3 py-2 rounded-lg m-2 min-w-[100px]"
                        onClick={handleLogout}
                    >
                        {" "}
                        {loadingCtx.loading ? <BtnLoader /> : "Logout"}
                    </button>
                )}
            </div>

            <div>
                <button
                    className=" bg-blue-600 p-3 m-2 rounded-xl"
                    name="go home"
                    onClick={handleBtn}
                >
                    Home
                </button>
                <button
                    className=" bg-blue-600 p-3 m-2 rounded-xl"
                    name="signup"
                    onClick={handleBtn}
                >
                    Signup
                </button>
                <button
                    className=" bg-blue-600 p-3 m-2 rounded-xl"
                    name="profile"
                    onClick={handleProfile}
                >
                    Profile
                </button>
            </div>
        </div>
    );
}

export default Login;
