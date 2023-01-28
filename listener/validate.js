const Decimal = require("decimal.js");
const WEI = 1000000000000000000;

const ethToWei = (amount) => new Decimal(amount).times(WEI);

function validateTransaction(trx) {
  if (trx === null) return false;
  const toValid = trx.to !== null;
  if (!toValid) return { valid: false, direction: false };

  const walletToValid =
    trx.to.toLowerCase() === process.env.WALLET_TO.toLowerCase();
  const walletFromValid =
    trx.from.toLowerCase() === process.env.WALLET_FROM.toLowerCase();

  if (walletFromValid) {
    return { valid: true, direction: "outgoing" };
  } else if (walletToValid) {
    return { valid: true, direction: "incoming" };
  } else {
    return { valid: false, direction: "" };
  }
}

module.exports = validateTransaction;
