async function getUserFollowings(userId) {
    const url = "http://localhost:8000/api/user/getUserFollowings/" + userId;
    const response = await fetch(url);

    if(response.status == 404)
        return null;
    
    const data = await response.json();
    return data;
}

async function getUserFollowers(userId) {
    const url = "http://localhost:8000/api/user/getUserFollowers/" + userId;
    const response = await fetch(url);

    if(response.status == 404)
        return null;
    
    const data = await response.json();
    return data;
}

export default {
    getUserFollowers,
    getUserFollowings
}