const dotenv = require("dotenv").config();
const Web3 = require("web3");
const validateTransaction = require("./validate.js");
const confirmEtherTransaction = require("./confirm.js");
const TOKEN_ABI = require("./abi");

function watchEtherTransfers(bot) {
  // Instantiate web3 with WebSocket provider
  const web3 = new Web3(
    new Web3.providers.WebsocketProvider(process.env.INFURA_WS_URL)
  );

  // Instantiate subscription object
  const subscription = web3.eth
    .subscribe("pendingTransactions", function (error, result) {
      if (error) console.log("===result===", error);
    })
    .on("connected", function (subscriptionId) {
      console.log("===connected===", subscriptionId);
    })
    .on("data", async (txHash) => {
      try {
        // Instantiate web3 with HttpProvider
        const web3Http = new Web3(process.env.INFURA_URL);

        // Get transaction details
        const trx = await web3Http.eth.getTransaction(txHash);

        const { valid, direction } = validateTransaction(trx);
        // If transaction is not valid, simply return
        if (!valid) return;

        let message;

        if (direction === "outgoing") {
          message =
            `[⛔️ OUTGOING TXN](https://goerli.etherscan.io/tx/${txHash}):\n\n` +
            `✉️ From: [${shortenAddress(
              trx.from.toLowerCase()
            )}](https://goerli.etherscan.io/address/${trx.from})\n` +
            `📪 To: [${shortenAddress(
              trx.to.toLowerCase()
            )}](https://goerli.etherscan.io/address/${trx.to})\n` +
            `💰 Txn value: ${gweiToEth(trx.value)} Ξ\n` +
            `#️⃣ Txn hash: [${shortenAddress(
              txHash
            )}](https://goerli.etherscan.io/tx/${txHash})\n`;
        } else if (direction === "incoming") {
          message =
            `[✅️ INCOMING TXN](https://goerli.etherscan.io/tx/${txHash}):\n\n` +
            `✉️ From: [${shortenAddress(
              trx.from.toLowerCase()
            )}](https://goerli.etherscan.io/address/${trx.from})\n` +
            `📪 To: [${shortenAddress(
              trx.to.toLowerCase()
            )}](https://goerli.etherscan.io/address/${trx.to})\n` +
            `💰 Txn value: ${gweiToEth(trx.value)} Ξ\n` +
            `🌱 Txn hash: [${shortenAddress(
              txHash
            )}](https://goerli.etherscan.io/tx/${txHash})\n`;
        }

        console.log("@@@@@ sending", valid, direction, process.env.CHAT_ID);
        // bot.telegram.sendMessage(process.env.CHAT_ID, message);
        bot.telegram.sendMessage(process.env.CHAT_ID, message, {
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        });

        // Initiate transaction confirmation
        confirmEtherTransaction(txHash, 1, bot);
      } catch (error) {
        console.log(error);
      }
    })
    .on("changed", function (log) {
      console.log("===changed===", log);
    });

  // // unsubscribes the subscription
  // subscription.unsubscribe(function (error, success) {
  //   if (success) console.log("Successfully unsubscribed!");
  // });
}

function shortenAddress(address) {
  return address.slice(0, 7) + "..." + address.slice(-6, -1);
}

function gweiToEth(value) {
  console.log("@@@@@@@", escape(Web3.utils.fromWei(value, "ether")));
  return escape(Web3.utils.fromWei(value, "ether"));
}

function watchTokenTransfers2() {
  // Instantiate web3 with WebSocketProvider
  const web3 = new Web3(
    new Web3.providers.WebsocketProvider(process.env.INFURA_WS_URL)
  );

  // Instantiate token contract object with JSON ABI and address
  const tokenContract = new web3.eth.Contract(
    TOKEN_ABI,
    process.env.TOKEN_CONTRACT_ADDRESS,
    (error, result) => {
      if (error) console.log(error);
    }
  );

  // Generate filter options
  const options = {
    filter: {
      _from: process.env.WALLET_FROM,
      _to: process.env.WALLET_TO,
      _value: process.env.AMOUNT,
    },
    fromBlock: "latest",
  };

  // Subscribe to Transfer events matching filter criteria
  tokenContract.events.Transfer(options, async (error, event) => {
    if (error) {
      console.log(error);
      return;
    }

    console.log(
      "Found incoming Pluton transaction from " +
        process.env.WALLET_FROM +
        " to " +
        process.env.WALLET_TO +
        "\n"
    );
    console.log("Transaction value is: " + process.env.AMOUNT);
    console.log("Transaction hash is: " + txHash + "\n");

    // Initiate transaction confirmation
    confirmEtherTransaction(event.transactionHash);

    return;
  });
}

module.exports = {
  watchEtherTransfers,
  watchTokenTransfers2,
};
