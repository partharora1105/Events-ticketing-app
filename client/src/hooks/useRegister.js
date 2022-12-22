import { useMutation } from "react-query";

const registerToAPI = async ({email, password, role}) => {
    let res = await fetch("/api/users/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: {email, password, role}
        })
    })
    return res.json();
};

export default function useRegister(onSuccess, onFailure) {
    const { mutate: registerUserToAPI} = useMutation("register", registerToAPI, {
      onSuccess: onSuccess,
      onFailure: onFailure
    });

    return { registerUserToAPI }
}