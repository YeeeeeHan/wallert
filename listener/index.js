require('./env')

const watcher = require('./watcher')
const trace = require('./trace')

// trace.replay()
watcher.watchEtherTransfers()
console.log('Started watching Ether transfers')

// watcher.watchTokenTransfers2()
// console.log('Started watching Pluton token transfers\n')
