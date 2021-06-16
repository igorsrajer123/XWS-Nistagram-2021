
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

async function getAllUsers(){
    const url = "http://localhost:8000/api/user/getAllUsers";  
    const response = await fetch(url);

    const data = await response.json();
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

async function getUserCoverPhoto(coverImageId){
    const url = "http://localhost:8000/api/user/getCoverPhoto/" + coverImageId;
    if(coverImageId != undefined && coverImageId != 0){
        var retVal = null;
        await fetch(url)
            .then(response => response.blob())
            .then(blob => {
                retVal = URL.createObjectURL(blob)
        });

        return retVal;
    }else {
        return null;
    }
}

async function getUserProfilePhoto(profileImageId){
    const url = "http://localhost:8000/api/user/getProfilePhoto/" + profileImageId;
    if(profileImageId != undefined && profileImageId != 0){
        var retVal = null;
        await fetch(url)
            .then(response => response.blob())
            .then(blob => {
                retVal = URL.createObjectURL(blob)
        });

        return retVal;
    }else {
        return null;
    }
}

async function getUserCloseFriends(userId){
    const url = "http://localhost:8000/api/user/getCloseFriends/" + userId;
    const response = await fetch(url);

    const data = await response.json();
    return data;
}

async function removeCloseFriend(userId, currentUserId){
    const url = "http://localhost:8000/api/user/removeCloseFriend/" + userId + "/" + currentUserId;
    await fetch(url, {
        method: "PUT"
    });
    window.location.reload();
}

async function addCloseFriend(userId, currentUserId){
    const url = "http://localhost:8000/api/user/addCloseFriend/" + userId + "/" + currentUserId;
    await fetch(url, {
        method: "PUT"
    });
    window.location.reload();
}


export default {
    editUserInfo,
    changePassword,
    getUserById,
    getUserCoverPhoto,
    getUserProfilePhoto,
    getAllUsers,
    getUserCloseFriends,
    removeCloseFriend,
    addCloseFriend
}
