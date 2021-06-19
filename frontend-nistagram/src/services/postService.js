async function getUserPosts(userId){
    const url = "http://localhost:8000/api/post/getUserPosts/" + userId;  
    const response = await fetch(url);
    
    if(response.status == 404)
        return null;

    const newData = await response.json();
    const sortedData = newData.sort((a, b) => b.id - a.id)
    return sortedData;
}

async function createStatusPost(post){
    const url = "http://localhost:8000/api/post/createStatusPost";  
    const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json',
                    'Access-Control-Request-Origin':'*',
                    'Access-Control-Request-Methods': '*',
                    'Access-Control-Request-Headers': '*'},
        body: JSON.stringify(post)
    }).catch(e => console.error(e));

    const data = response.text();
    window.location.reload();
    return data;
}

async function likePost(postId, userId){
    const url = "http://localhost:8000/api/post/likePost/" + postId + "/" + userId;  
    const response = await fetch(url, {
        method: "PUT"
    })
}

async function dislikePost(postId, userId){
    const url = "http://localhost:8000/api/post/dislikePost/" + postId + "/" + userId;
    const response = await fetch(url, {
        method: "PUT"
    })
}

async function getLikedPosts(userId){
    const url = "http://localhost:8000/api/post/getLikedPosts/" + userId;
    const response = await fetch(url);
    
    if(response.status == 404)
        return null;
    
    const data = await response.json();
    return data;
}

async function getDislikedPosts(userId){
    const url = "http://localhost:8000/api/post/getDislikedPosts/" + userId;
    const response = await fetch(url);
    
    if(response.status == 404)
        return null;
    
    const data = await response.json();
    return data;
}

async function getHomepagePosts(userId){
    const url = "http://localhost:8000/api/post/getUserPosts/" + userId;  
    const response = await fetch(url);
    
    var currentUserPosts = null;
    if(response.status == 404)
        currentUserPosts = null;
    
    currentUserPosts = await response.json();

    const url2 = "http://localhost:8000/api/user/getUserFollowings/" + userId;  
    const response2 = await fetch(url2);

    var currentUserFollowings = null;
    if(response2.status == 404)
        currentUserFollowings = null;
    
    currentUserFollowings = await response2.json();

    var followingsPosts = [];
    if(currentUserFollowings != null){
        for(var i = 0; i < currentUserFollowings.length; i++){
            const url3 = "http://localhost:8000/api/post/getUserPosts/" + currentUserFollowings[i].id;  
            const response3 = await fetch(url3);
        
            const oneResponse = await response3.json();
            followingsPosts = [...followingsPosts, ...oneResponse];
        }
    }

    var retVal = [...currentUserPosts, ...followingsPosts];
    const homepagePosts = retVal.sort((a, b) => b.id - a.id);

    return homepagePosts;
}

async function getPostPhoto(imageId){
    const url = "http://localhost:8000/api/post/getPostPhoto/" + imageId;
    if(imageId != undefined && imageId != 0){
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

async function getPostComments(postId){
    const url = "http://localhost:8000/api/post/getPostComments/" + postId;
    const response = await fetch(url);

    const data = await response.json();
    return data;
}

async function postNewComment(comment){
    const url = "http://localhost:8000/api/post/addComment";
    const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json'
                },
        body: JSON.stringify(comment)
    }).catch(e => console.error(e));
}

async function getFavouritePosts(userId){
    const url = "http://localhost:8000/api/post/getUserFavourites/" + userId;
    const response = await fetch(url);

    const data = await response.json();
    return data;
}

async function addToFavourites(postId, userId){
    const url = "http://localhost:8000/api/post/addToFavourites/" + postId + "/" + userId;
    await fetch(url, {
        method: "PUT"
    });
    window.location.reload();
}

async function removeFromFavourites(postId, userId){
    const url = "http://localhost:8000/api/post/removeFromFavourites/" + postId + "/" + userId;
    await fetch(url, {
        method: "PUT"
    });
    window.location.reload();
}

export default{
    getUserPosts,
    createStatusPost,
    likePost,
    dislikePost,
    getHomepagePosts,
    getPostPhoto,
    getPostComments,
    postNewComment,
    getFavouritePosts,
    addToFavourites,
    removeFromFavourites,
    getLikedPosts,
    getDislikedPosts
}