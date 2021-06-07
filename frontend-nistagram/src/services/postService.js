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

    const data = await response.text();
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

export default{
    getUserPosts,
    createStatusPost,
    likePost,
    dislikePost
}