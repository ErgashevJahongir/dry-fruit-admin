import { useState } from "react";

export default function useToken() {
    const getToken = () => {
        const tokenStringSes = sessionStorage.getItem("dry-fruit");
        const tokenStringLoc = localStorage.getItem("dry-fruit");
        const userToken = JSON.parse(tokenStringSes || tokenStringLoc);
        return userToken;
    };

    const [token, setToken] = useState(getToken());

    const saveToken = (userToken, save) => {
        save
            ? localStorage.setItem("dry-fruit", JSON.stringify(userToken))
            : sessionStorage.setItem("dry-fruit", JSON.stringify(userToken));
        setToken(userToken);
    };

    return {
        setToken: saveToken,
        token,
    };
}
