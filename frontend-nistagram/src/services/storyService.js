import FollowService from './followService';

async function getUserStories(userId){
    const url = "http://localhost:8000/api/post/getUserStories/" + userId;  
    const response = await fetch(url);
    
    if(response.status == 404)
        return null;

    const newData = await response.json();
    const sortedData = newData.sort((a, b) => b.id - a.id)
    return sortedData;
}

async function showHomepageStories(userId){
    var currentUserStories = [];
    const url = "http://localhost:8000/api/post/getUserStories/" + userId;  
    const response = await fetch(url);
    
    const data1 = await response.json();
    if(data1.length != 0)
        for(var i = 0; i < data1.length; i++)
            if(data1[i].visible == true)
                currentUserStories.push(data1[i]);
    
    var followingsStories = [];
    const followings = await FollowService.getUserFollowings(userId);
    if(followings != undefined && followings != null){
        if(followings.length != 0){
            for(var i = 0; i < followings.length; ++i){
                const url2 = "http://localhost:8000/api/user/isInCloseFriends/" + userId + "/" + followings[i].id;  
                const response2 = await fetch(url2);
                const temp = await response2.json();
                if(temp == true){
                    var oneFollowingStories = await getUserStories(followings[i].id);
                    if(oneFollowingStories.length != 0)
                        for(var i = 0; i < oneFollowingStories.length; i++)
                            if(oneFollowingStories[i].visible == true)
                                followingsStories.push(oneFollowingStories[i]);
                }else {
                    var oneFollowingStories = await getUserStories(followings[i].id);
                    if(oneFollowingStories.length != 0)
                        for(var j = 0; j < oneFollowingStories.length; j++)
                            if(oneFollowingStories[j].visible == true && oneFollowingStories[j].CloseFriendsOnly == false)
                                followingsStories.push(oneFollowingStories[j]);
                }
            }
        }
    }

    var finalStories = [];
    finalStories = currentUserStories.concat(followingsStories);
    return finalStories;       
}

export default {
    getUserStories,
    showHomepageStories
}