module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id,
      from: '0x73732b4bD5Ed78105CC0Ed7eD1A1431e41C49124'
    },
    develop: {
      port: 8545
    }
  },
  compilers: {
    solc: {
      version: "0.8.0"
    }
  }
};
