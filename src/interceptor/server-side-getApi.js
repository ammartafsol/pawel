import { cookies } from "next/headers";
import { handleDecrypt } from "./encryption";
import { baseURL } from "@/resources/utils/helper";
import axios from "axios";
import { TOKEN_COOKIE_NAME } from "@/resources/utils/cookie";

export const getApi = async (endpoint = "") => {
  const Cookies = await cookies();
  const value = Cookies.get(TOKEN_COOKIE_NAME)?.value;
  const accessToken = value && handleDecrypt(value);

  try {
    const response = await axios.get(baseURL(endpoint), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response?.data?.data);
    return response?.data;
  } catch (error) {
    console.log("🚀  getApi  error:", error);
    return null;
  }
};
