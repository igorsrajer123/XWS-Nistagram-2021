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

async function likePost(postId){
    const url = "http://localhost:8000/api/post/likePost/" + postId;  
    const response = await fetch(url, {
        method: "PUT"
    })
}

async function dislikePost(postId){
    const url = "http://localhost:8000/api/post/dislikePost/" + postId;
    const response = await fetch(url, {
        method: "PUT"
    })
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

export default{
    getUserPosts,
    createStatusPost,
    likePost,
    dislikePost,
    getHomepagePosts
}