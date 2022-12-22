import { useQuery } from "react-query";
import { getJWT } from "../util/JWTHelpers";

const fetchEvents = async () => {
  let res = await fetch("/api/events", {
      credentials: "include",
      headers: {
        "Authorization": `Bearer ${getJWT()}`
      }
  })
  return res.json();
};

export default function useEvents() {
  const { data, isLoading} = useQuery("events", fetchEvents);

  const isError = data && data.error;
  return { data, isLoading, isError }
}