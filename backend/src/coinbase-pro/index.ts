import CoinbasePro from 'coinbase-pro';
// import { test } from '../repo';
import { COINBASE_PRO_API_PASSPHRASE, COINBASE_PRO_API_KEY, COINBASE_PRO_API_SECRET } from '../secrets';
import logger from 'pino';

/**
 * A function that verifies coinbase pro credentials
 * @return {object}
 */
function getCoinbaseProStatus() {
    // const key = 'your_api_key';
    // const secret = 'your_b64_secret';
    // const passphrase = 'your_passphrase';

    // const apiURI = 'https://api.pro.coinbase.com';
    const sandboxURI = 'https://api-public.sandbox.pro.coinbase.com';

    const authedClient = new CoinbasePro.AuthenticatedClient(
    COINBASE_PRO_API_KEY,
    COINBASE_PRO_API_SECRET,
    COINBASE_PRO_API_PASSPHRASE,
    sandboxURI
    );

    logger().info(authedClient)

    authedClient.getCoinbaseAccounts((resp)=> {
        logger().info(resp)
    });

    // test();
    return true;
}

export {
    getCoinbaseProStatus
}