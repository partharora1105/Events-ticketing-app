import { useMutation } from "react-query";
import { getJWT } from "../util/JWTHelpers";

const addRSVPToAPI = async ({rsvpStatus, eventID, userID}) => {
    let res = await fetch(`/api/events/${eventID}/rsvp`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getJWT()}`
        },
        body: JSON.stringify({
          data: {rsvp: rsvpStatus, user_id: userID}
        })
    })
    return res.json();
};

export default function useRSVP(onComplete, onFailure) {
    const { mutate: addRSVP} = useMutation("addRSVP", addRSVPToAPI, {
      onSuccess: onComplete,
      onError: onFailure
    });

    return { addRSVP }
}