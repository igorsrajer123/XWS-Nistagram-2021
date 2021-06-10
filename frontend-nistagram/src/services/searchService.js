import LoginService from './loginService';

async function publicSearch(searchParams) {
    const url = "http://localhost:8000/api/user/searchPublicProfiles/" + searchParams;
    const response = await fetch(url);

    if(response.status == 404)
        return null;
    
    const data = await response.json();
    return data;
}

async function privateSearch(searchParams) {
    const url = "http://localhost:8000/api/user/searchAllProfiles/" + searchParams;
    const response = await fetch(url);

    if(response.status == 404)
        return null;
    
    const data = await response.json();
    return data;
}

async function publicPostsSearch(searchParams) {
    const url = "http://localhost:8000/api/post/searchPublicPosts/" + searchParams;
    const response = await fetch(url);

    if(response.status == 404)
        return null;
    
    const data = await response.json();
    return data;
}

async function privatePostsSearch(searchParams) {
    const publicPosts = await publicPostsSearch(searchParams);
    const currentUser = await LoginService.getCurrentUser();

    if(currentUser == null){
        window.location.href = "/";
    }
    
    const url2 = "http://localhost:8000/api/user/getUserFollowings/" + currentUser.id;  
    const response2 = await fetch(url2);

    var currentUserFollowings = null;
    if(response2.status != 404)
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

    var correctFollowingsPosts = [];
    var searchParamsToLowerCase = searchParams.toLowerCase();
    for(var i = 0; i < followingsPosts.length; i++){
        var locationLowerCase = followingsPosts[i].location.toLowerCase();

        if(locationLowerCase.includes(searchParamsToLowerCase)){
            correctFollowingsPosts = [...correctFollowingsPosts, followingsPosts[i]];
            continue;
        }

        for(var j = 0; j < followingsPosts[i].tags.length; j++){
            var tagLowerCase = followingsPosts[i].tags[j].toLowerCase();
            if(tagLowerCase.includes(searchParamsToLowerCase)){
                correctFollowingsPosts = [...correctFollowingsPosts, followingsPosts[i]];
                break;
            }
        }
    }
    
    var retVal = [];
    if(publicPosts == null && correctFollowingsPosts != null)
        retVal = correctFollowingsPosts;
    
    if(correctFollowingsPosts == null && publicPosts != null)
        retVal = publicPosts;
    
    if(correctFollowingsPosts == null && publicPosts == null)
        retVal = null;

    if(correctFollowingsPosts != null && publicPosts != null){
        for(var i = 0; i < publicPosts.length; i++){
            retVal = [...retVal, publicPosts[i]];
        }

        for(var j = 0; j < correctFollowingsPosts.length; j++){
            retVal = [...retVal, correctFollowingsPosts[j]];
        }
    }

    retVal = Array.from(new Set(retVal.map(p => p.id))).map(id =>{
        return retVal.find(p => p.id ===id);
    });

    console.log(retVal);
    return retVal;
}

export default {
    publicSearch,
    privateSearch,
    publicPostsSearch,
    privatePostsSearch
}