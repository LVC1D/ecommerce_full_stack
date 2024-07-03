import axios from "axios";

export default axios.create({
    baseURL: 'https://localhost:3400',
    withCredentials: true // ensures the cookie is captured
});