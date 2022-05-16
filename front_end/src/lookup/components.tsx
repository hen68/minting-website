// const axios = require('axios').default;

export function backendLookup(method: string, endpoint: string, callback: Function, data: object) {
    const xhr = new XMLHttpRequest()
    const url = 'http://localhost:3600/' + endpoint

    xhr.responseType = "json"
    xhr.open(method, url)
    xhr.setRequestHeader("Content-Type", "application/json")

    xhr.onload = function () {
        callback(xhr.response, xhr.status)
    }
    xhr.onerror = function (e) {
        console.log(e)
        callback({ "message": "The request was an error" }, 400)
    }
    // console.log(data)
    xhr.send(JSON.stringify(data))

    // axios.post('http://localhost:3600/' + endpoint, data)
    //     .then(function (response) {
    //         // handle success
    //         console.log(response);
    //     })
}