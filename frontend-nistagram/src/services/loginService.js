async function login(credentials) {

    const url = "http://localhost:8000/api/auth/login";  
    const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json',
                    'Access-Control-Request-Origin':'*',
                    'Access-Control-Request-Methods': '*',
                    'Access-Control-Request-Headers': '*'},
        body: JSON.stringify(credentials)
    }).catch(e => console.error(e));

    return response.status;
}

async function getCurrentUser() {
    const url = "http://localhost:8000/api/auth/getCurrentUser";  
    const response = await fetch(url);
    const data = await response.text();
    
    if(response.status == 401)
        return null;

    const newUrl = "http://localhost:8000/api/user/getUserByEmail/" + data;
    const newResponse = await fetch(newUrl);
    const newData = await newResponse.json();
    return newData;
}

async function logout() {
    const url = "http://localhost:8000/api/auth/logout";  
    const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json',
                    'Access-Control-Request-Origin':'*',
                    'Access-Control-Request-Methods': '*',
                    'Access-Control-Request-Headers': '*'},
    }).catch(e => console.error(e));

    window.location.href = "/";
}

export default {
    login,
    getCurrentUser,
    logout
}