async function submitReport(report){
    const url = "http://localhost:8000/api/report/submitReport";   
    const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json',
                    'Access-Control-Request-Origin':'*',
                    'Access-Control-Request-Methods': '*',
                    'Access-Control-Request-Headers': '*'},
        body: JSON.stringify(report)
    }).catch(e => console.error(e));

    const data = await response.json();
    window.location.reload();
    return data;
}

export default {
    submitReport
}