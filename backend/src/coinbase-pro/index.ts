import { CoinbasePro, Account} from 'coinbase-pro-node';
import logger from 'pino';

import { Context } from '../context';

import { createCoinbaseProAccount } from '../repo';

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
    console.log({authedClient: JSON.stringify(authedClient)});
    
    try {
        const accounts = await authedClient.rest.account.listAccounts();
        console.log({accounts: JSON.stringify(accounts)});
        const message = `You can trade "${accounts.length}" different pairs.`;
        logger().info(message);
        return true;
    } catch (err){
        throw new Error('Invalid Coinbase Pro Account')
    }
}

/**
 * A function that saves coinbase pro credentials to the database
 * @param {Context} prisma
 * @param {boolean} accountStatus
 * @param {string} investorId
 * @param {string} nickname
 * @param {string} key
 * @param {string} secret
 * @param {string} passphrase
 * @return boolean
 */
async function saveCoinbaseProCredentials(
    prisma: Context,
    accountStatus: boolean,
    investorId: string,
    nickname: string,
    key: string,
    secret: string,
    passphrase: string
) {
    if (accountStatus) {
        createCoinbaseProAccount(
            investorId,
            nickname,
            key,
            passphrase,
            secret,
            prisma,
        )
    } else {
        throw new Error('Error saving database credentials');
    }
    return true
}

export {
    getCoinbaseProStatus,
    saveCoinbaseProCredentials
}