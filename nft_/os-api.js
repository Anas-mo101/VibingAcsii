fetch = require("node-fetch");

const KEY = '3b5cc96012164b7eb22d3905b2b08ce5';
const CONTRACT = "0x495f947276749ce646f68ac8c248420045cb7b5e";


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


const isOwner = async (wid) =>{
    let nftsOwned = [];
    const url = `https://api.opensea.io/api/v1/assets?owner=${wid}&order_direction=desc&limit=45&include_orders=false`;

    const options = {
        method: 'GET',
        headers: {Accept: 'application/json', 'X-API-KEY': KEY}
    };

    return fetch(url, options) 
    .then(res => res.json())
    .then(data => {
        data.assets.forEach(nft => {
            if(nft.asset_contract.address === CONTRACT) {
                nftsOwned.push(nft);
            }
        })
        return nftsOwned.length > 0 ? true : false
    })
    .catch(err => {
        console.error('error:' + err);
        return false;
    });
}

const VaOwned = async (wid) =>{
    let nftsOwned = [];
    const url = `https://api.opensea.io/api/v1/assets?owner=${wid}&order_direction=desc&limit=45&include_orders=false`;

    const options = {
        method: 'GET',
        headers: {Accept: 'application/json', 'X-API-KEY': KEY}
    };

    return fetch(url, options) 
    .then(res => res.json())
    .then(data => {
        data.assets.forEach(nft => {
            if(nft.asset_contract.address === CONTRACT) {
                nftsOwned.push(nft);
            }
        })
        return nftsOwned;
    })
    .catch(err => {
        console.error('error:' + err);
        return [];
    });
}


module.exports.VaOwned = VaOwned;
module.exports.getCollection = getCollection;
module.exports.isOwner = isOwner;
