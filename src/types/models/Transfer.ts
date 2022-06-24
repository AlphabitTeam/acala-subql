// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type TransferProps = Omit<Transfer, NonNullable<FunctionPropertyNames<Transfer>>>;

export class Transfer implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public fromId?: string;

    public toId?: string;

    public tokenId?: string;

    public amount?: string;

    public amountInUSD?: string;

    public timestamp?: Date;

    public isSuccess?: boolean;

    public extrinsicId?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Transfer entity without an ID");
        await store.set('Transfer', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Transfer entity without an ID");
        await store.remove('Transfer', id.toString());
    }

    static async get(id:string): Promise<Transfer | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Transfer entity without an ID");
        const record = await store.get('Transfer', id.toString());
        if (record){
            return Transfer.create(record as TransferProps);
        }else{
            return;
        }
    }


    static async getByFromId(fromId: string): Promise<Transfer[] | undefined>{
      
      const records = await store.getByField('Transfer', 'fromId', fromId);
      return records.map(record => Transfer.create(record as TransferProps));
      
    }

    static async getByToId(toId: string): Promise<Transfer[] | undefined>{
      
      const records = await store.getByField('Transfer', 'toId', toId);
      return records.map(record => Transfer.create(record as TransferProps));
      
    }

    static async getByTokenId(tokenId: string): Promise<Transfer[] | undefined>{
      
      const records = await store.getByField('Transfer', 'tokenId', tokenId);
      return records.map(record => Transfer.create(record as TransferProps));
      
    }

    static async getByExtrinsicId(extrinsicId: string): Promise<Transfer[] | undefined>{
      
      const records = await store.getByField('Transfer', 'extrinsicId', extrinsicId);
      return records.map(record => Transfer.create(record as TransferProps));
      
    }


    static create(record: TransferProps): Transfer {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new Transfer(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
