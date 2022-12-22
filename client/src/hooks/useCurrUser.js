import { useQuery } from "react-query";
import { getJWT } from "../util/JWTHelpers";

const fetchCurrUser = async () => {
  let res = await fetch("/api/users/currUser", {
      credentials: "include",
      headers: {
        "Authorization": `Bearer ${getJWT()}`
      }
  })
  return res.json();
};

export default function useCurrUser() {
  const { data, isLoading} = useQuery("currUser", fetchCurrUser);

  const isError = data && data.error;
  return { data, isLoading, isError }
}