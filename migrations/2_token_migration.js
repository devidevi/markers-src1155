const contract = artifacts.require("Markers");

module.exports = async function (deployer) {
    var url = "ipfs://";
    var cost = 1;
    var revealed = false;

    await deployer.deploy(contract, url, cost, revealed);
};
