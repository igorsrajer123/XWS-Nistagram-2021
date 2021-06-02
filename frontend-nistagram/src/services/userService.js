
async function editUserInfo(user){

    const url = "http://localhost:8000/api/user/editUserInfo";  
    const response = await fetch(url, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json',
                    'Access-Control-Request-Origin':'*',
                    'Access-Control-Request-Methods': '*',
                    'Access-Control-Request-Headers': '*'},
        body: JSON.stringify(user)
    }).catch(e => console.error(e));

    const data = await response.json();
    window.location.reload();
    return data;
}

async function changePassword(user){
    const url = "http://localhost:8000/api/user/changePassword";  
    const response = await fetch(url, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json',
                    'Access-Control-Request-Origin':'*',
                    'Access-Control-Request-Methods': '*',
                    'Access-Control-Request-Headers': '*'},
        body: JSON.stringify(user)
    }).catch(e => console.error(e));

    const data = await response.json();
    window.location.reload();
    return data;
}

async function getUserById(id){
    const url = "http://localhost:8000/api/user/getById/" + id;
    const response = await fetch(url);

    if(response.status == 404)
        return null;
    
    const data = await response.json();
    return data;
}

export default {
    editUserInfo,
    changePassword,
    getUserById
}
