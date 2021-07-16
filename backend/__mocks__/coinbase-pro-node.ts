const returnedAccounts = [
    {
        "id": "71452118-efc7-4cc4-8780-a5e22d4baa53",
        "currency": "BTC",
        "balance": "0.0000000000000000",
        "available": "0.0000000000000000",
        "hold": "0.0000000000000000",
        "profile_id": "75da88c5-05bf-4f54-bc85-5c775bd68254",
        "trading_enabled": true
    },
    {
        "id": "e316cb9a-0808-4fd7-8914-97829c1925de",
        "currency": "USD",
        "balance": "80.2301373066930000",
        "available": "79.2266348066930000",
        "hold": "1.0035025000000000",
        "profile_id": "75da88c5-05bf-4f54-bc85-5c775bd68254",
        "trading_enabled": true
    }
]

export class CoinbasePro {
    readonly rest = new RESTClient()
    constructor(auth = {
        apiKey: '',
        apiSecret: '',
        passphrase: '',
        useSandbox: false,
    }) {
    }
  }

class RESTClient {
    readonly account: AccountAPI;
    constructor() {
        this.account = new AccountAPI();
    }
    
}

export class AccountAPI { 
    constructor() {
    }

    listAccounts() {
        return new Promise<any>((resolve) => {
          resolve(returnedAccounts);
      });
    }
}