import axios from "axios";
import { Server } from "../../Constants";

export const refreshAccessToken = async (func, loginCtx, refreshToken) => {

  const rtoken = refreshToken || loginCtx.refreshToken;

  if (!rtoken) return console.log("Please login again");

  try {
    const resp = await axios.get(`${Server}/users/verify-refresh-token`, {
      headers: {
        Authorization: `Bearer ${rtoken}`,
      },
    });
    // console.log(resp.data);
    if (resp.data.statusCode === 200 ) {

      loginCtx.setAccessToken(resp.data.data.newAccessToken);
      loginCtx.setRefreshToken(resp.data.data.newRefreshToken);
     
      func(resp.data.data.newAccessToken, resp.data.data.newRefreshToken);
      
    } 
  } catch (err) {
    // console.log(err);
    console.log("Please login again");
  }
}