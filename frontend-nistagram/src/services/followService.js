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

async function followUser(currentUserId, followUserId) {
    const url = "http://localhost:8000/api/user/follow/" + currentUserId + "/" + followUserId;
    const response = await fetch(url, {
        method: "PUT"
    });

    return response;
}

async function getFollowRequests(followUserId) {
    const url = "http://localhost:8000/api/user/getUserFollowRequests/" + followUserId;
    const response = await fetch(url);

    if(response.status == 404)
        return null;

    const data = await response.json();
    return data;
}

export default {
    getUserFollowers,
    getUserFollowings,
    followUser,
    getFollowRequests
}