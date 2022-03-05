const Moralis  = require('moralis/node');

const serverUrl = "https://2lk8fl39w5mb.usemoralis.com:2053/server";
const appId = "HzIJGDTMj8j3Zo1suYV80nolo5nrHRI7Ina6V443";

Moralis.start({ serverUrl, appId });

const getCol = async () =>{
    // let nfts = [];

    // get token id from db

    let nft = await Moralis.Plugins.opensea.getAsset({
        network: 'mainnet',
        tokenAddress: '0x495f947276749Ce646f68AC8c248420045cb7b5e',
        tokenId: '75876625577037056561078655283912763371900539884597186659402012290495813779457',
    });

    return nft;
}

module.exports.getCol = getCol;