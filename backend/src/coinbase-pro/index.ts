import { CoinbasePro } from 'coinbase-pro-node';
import logger from 'pino';

/**
 * A function that verifies coinbase pro credentials
 * @param {string} key
 * @param {string} secret
 * @param {string} passphrase
 * @param {boolean} useSandbox
 * @return boolean
 */
async function getCoinbaseProStatus(key: string, secret: string, passphrase: string, useSandbox: boolean) {
    const authedClient = new CoinbasePro({
    apiKey: key,
    apiSecret: secret,
    passphrase,
    useSandbox
    });

    const accounts = await authedClient.rest.account.listAccounts();
    const message = `You can trade "${accounts.length}" different pairs.`;
    logger().info(message);
    return true;
}

export {
    getCoinbaseProStatus
}