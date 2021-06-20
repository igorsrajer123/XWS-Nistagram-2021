async function getUserStatus(userId){
    const url = "http://localhost:8000/api/user/getValidationRequests";  
    const response = await fetch(url);
    
    const data = await response.json();

    var accountVerified = false;
    for(var i = 0; i < data.length; ++i){
        if(userId == data.userId || data.status == "ACTIVE"){
            accountVerified = true;
            break;
        }
    }

    return accountVerified;
}

export default {
    getUserStatus
}
