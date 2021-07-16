

const returnedAccounts = [
    {account1: '1'},
    {account2: '2'},
    {account3: '3'},
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

class AccountAPI { 
    constructor() {
    }

    listAccounts() {
        return new Promise<any>((resolve) => {
            resolve(returnedAccounts);
        });
    }
}