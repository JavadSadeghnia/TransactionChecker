const Web3 = require('web3');

class TransactionChecker {
    web3;
    account;

    constructor(projectId, account) {
        this.web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/4adb25ba68ee4df7a3129096d5cff115'));
        this.account = account.toLowerCase();
    }

    async checkBlock() {
         let block = await this.web3.eth.getBlock('latest');
         let number = block.number;
         console.log('Searching block ' + number);

        if (block != null && block.transactions != null) {
            for (let txHash of block.transactions) {
                let tx = await this.web3.eth.getTransaction(txHash);
                if(this.account == tx.to.toLowerCase()) {
                    console.log('Transaction found on block: ' + number);
                    console.log({address: tx.from, value: this.web3.utils.fromWei(tx.value, 'ether'), timestamp: new Date()});
                }
            }
        }
    }
}

let txChecker = new TransactionChecker(process.env.INFURA_ID, '0x08F5f8beB7a05091F461ba1B211AeBB1246728EC');
setInterval(() => {
    txChecker.checkBlock();
}, 15 * 1000);
