import { CoinbasePro } from 'coinbase-pro-node';
// import { test } from '../repo';
import { COINBASE_PRO_API_PASSPHRASE, COINBASE_PRO_API_KEY, COINBASE_PRO_API_SECRET } from '../secrets';
import logger from 'pino';

/**
 * A function that verifies coinbase pro credentials
 * @param {string} key
 * @param {string} secret
 * @param {string} passphrase
 * @param {boolean} useSandbox
 * @return boolean
 */
function getCoinbaseProStatus(key: string, secret: string, passphrase: string, useSandbox: boolean) {
    const authedClient = new CoinbasePro({
    apiKey: key,
    apiSecret: secret,
    passphrase,
    useSandbox
    });

    // logger().info(authedClient)

    authedClient.rest.account.listAccounts().then(accounts => {
        const message = `You can trade "${accounts.length}" different pairs.`;
        logger().info(message)
    });
    return true;
}

// delete class instance
// https://stackoverflow.com/questions/21118952/javascript-create-and-destroy-class-instance-through-class-method/21119696

export {
    getCoinbaseProStatus
}