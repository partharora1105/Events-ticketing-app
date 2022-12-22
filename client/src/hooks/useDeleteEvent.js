import { useMutation } from "react-query";
import { getJWT } from "../util/JWTHelpers";

const deleteEventToAPI = async ({eventId}) => {
    let res = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${getJWT()}`
        }
    })
    return res.json();
};

export default function useDeleteEvent(onComplete, onFailure) {
    const { mutate: deleteEvent } = useMutation("deleteEvent", deleteEventToAPI, {
      onSuccess: onComplete,
      onError: onFailure
    });

    return { deleteEvent }
}