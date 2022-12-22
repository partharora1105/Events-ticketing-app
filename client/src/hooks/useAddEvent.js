import { useMutation } from "react-query";
import { getJWT } from "../util/JWTHelpers";

const addEventToAPI = async ({category, startDate, endDate, description, location, name, inviteOnly, guestList, capacity}) => {
  let res = await fetch("/api/events", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getJWT()}`
        },
        body: JSON.stringify({
          data: {category, start_date: startDate, end_date: endDate, description, street_address: location.street_address, room_number : location.room_number, coordinates: [location.coordinates[0], location.coordinates[1]], name, inviteOnly, invites_string: inviteOnly ? guestList.trim() : undefined, capacity}
        })
    })
    return res.json();
};

export default function useAddEvent(onComplete, onFailure) {
    const { mutate: addEvent} = useMutation("addEvent", addEventToAPI, {
      onSuccess: onComplete,
      onError: onFailure
    });

    return { addEvent }
}