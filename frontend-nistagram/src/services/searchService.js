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

export default {
    publicSearch,
    privateSearch
}