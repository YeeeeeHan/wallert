require("dotenv").config();
const Web3 = require("web3");

const web3 = new Web3(process.env.GOERLI_URL);

const desiredTransactionHash =
  "0x64b48076e31b351cca24cabf1dcdd59df5821a2030e383a81e7844da533001f1";

function replay() {
  console.log("in replay");
  web3.currentProvider.send(
    {
      method: "trace_replayTransaction",
      params: [desiredTransactionHash, ["trace"]],
      jsonrpc: "2.0",
      id: "1",
    },
    function (err, out) {
      console.log(out);
    }
  );
}

module.exports = {
  replay,
};
