
async function registration(newUser) {

    const url = "http://localhost:8000/api/user/createUser";  
    const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json',
                    'Access-Control-Request-Origin':'*',
                    'Access-Control-Request-Methods': '*',
                    'Access-Control-Request-Headers': '*'},
        body: JSON.stringify(newUser)
    }).catch(e => console.error(e));

    const data = await response.json();
    return data;
}



export default {
    login
}