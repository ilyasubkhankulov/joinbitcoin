import { CoinbasePro, Account} from 'coinbase-pro-node';
import logger from 'pino';

import { Context } from '../context';
import { createCoinbaseProAccount, getValidAccount } from '../repo';

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

    try {
        const accounts = await authedClient.rest.account.listAccounts();
        const message = `You can trade "${accounts.length}" different pairs.`;
        logger().info(message);
        return accounts;
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
    if (!accountStatus) {
        throw new Error('Coinbase API Account is not active.');
    } else {
        try {
            await createCoinbaseProAccount(
                investorId,
                nickname,
                key,
                passphrase,
                secret,
                prisma,
            )
        } catch (err) {
            logger().error(err);
            throw new Error('Error saving database credentials.');
        }
    }
    return true
}


/**
 * A function that checks if a valid coinbase pro account exists
 * @param {Context} prisma
 * @param {string} investorId
 * @return boolean
 */
 async function verifyValidAccountExists(
    prisma: Context,
    investorId: string,
) {
    try {
        const validAccount:any = await getValidAccount(
            investorId,
            prisma,
        )
        return validAccount.id
    } catch (err) {
        logger().error(err);
        throw new Error('Error finding a valid coinbase pro account.');
    }
}


export {
    getCoinbaseProStatus,
    saveCoinbaseProCredentials,
    verifyValidAccountExists,
}