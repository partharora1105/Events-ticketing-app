import { useMutation } from "react-query";

const loginToAPI = async ({email, password}) => {
    let res = await fetch("/api/users/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: {email, password}
        })
    })
    return res.json();
};

export default function useLogin(onSuccess, onFailure) {
    const { mutate: loginUserToAPI} = useMutation("login", loginToAPI, {
      onSuccess: onSuccess,
      onError: onFailure
    });

    return { loginUserToAPI }
}