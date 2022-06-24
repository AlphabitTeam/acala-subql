// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type AccountBalanceProps = Omit<AccountBalance, NonNullable<FunctionPropertyNames<AccountBalance>>>;

export class AccountBalance implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public accountId?: string;

    public tokenId?: string;

    public total?: bigint;

    public free?: bigint;

    public reserved?: bigint;

    public frozen?: bigint;

    public updateAtBlock?: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save AccountBalance entity without an ID");
        await store.set('AccountBalance', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove AccountBalance entity without an ID");
        await store.remove('AccountBalance', id.toString());
    }

    static async get(id:string): Promise<AccountBalance | undefined>{
        assert((id !== null && id !== undefined), "Cannot get AccountBalance entity without an ID");
        const record = await store.get('AccountBalance', id.toString());
        if (record){
            return AccountBalance.create(record as AccountBalanceProps);
        }else{
            return;
        }
    }


    static async getByAccountId(accountId: string): Promise<AccountBalance[] | undefined>{
      
      const records = await store.getByField('AccountBalance', 'accountId', accountId);
      return records.map(record => AccountBalance.create(record as AccountBalanceProps));
      
    }

    static async getByTokenId(tokenId: string): Promise<AccountBalance[] | undefined>{
      
      const records = await store.getByField('AccountBalance', 'tokenId', tokenId);
      return records.map(record => AccountBalance.create(record as AccountBalanceProps));
      
    }


    static create(record: AccountBalanceProps): AccountBalance {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new AccountBalance(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
