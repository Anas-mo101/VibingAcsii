fetch = require("node-fetch");

const PORTKEY = 'c2eba553-c6cc-41ed-a279-7d54ccbd8b62';
const CONTRACT = '';

const isOwner = async (wid) =>{
    let nftsOwned = [];
    let url = `https://api.nftport.xyz/v0/accounts/${wid}?chain=ethereum`;

    let options = {
        method: 'GET',
        qs: {chain: 'ethereum'},
        headers: {'Content-Type': 'application/json', Authorization: PORTKEY}
    };

    fetch(url, options)
    .then(res => res.json())
    .then(data => {
        data.nfts.forEach(nft => {
            if(nft.contract_address === CONTRACT) {
                nftsOwned.push(nft.token_id)
            }
        })
    })
    .catch(err => {
        console.error('error:' + err);
    });

    return{
        isHolder: nftsOwned.length > 0 ? true : false,
        nftsOwned
    }
}

module.exports.isOwner = isOwner;