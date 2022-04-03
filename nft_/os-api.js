fetch = require("node-fetch");

const KEY = '3b5cc96012164b7eb22d3905b2b08ce5';

const getCollection = async () =>{
    const url = 'https://api.opensea.io/api/v1/assets?collection=vibing-ascii&order_direction=desc&limit=45&include_orders=false';

    const options = {
        method: 'GET',
        headers: {Accept: 'application/json', 'X-API-KEY': KEY}
    };
      
    return fetch(url, options)
    .then(response => response.json())
    .then(response => 
        {
            return response.assets;
        }
    )
    .catch(err => {
        console.log("Error @ os-api:" + err);
        return [];
    });
}

module.exports.getCollection = getCollection;