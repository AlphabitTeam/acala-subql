import { Account } from "../types"

export async function ensureAccount (account: string) {
    const record = await Account.get(account)

    if (record) return record

    const temp = new Account(account)
    temp.address = account;
    temp.txCount = BigInt(0);

    await temp.save()

    return temp
}

export async function getAccount (account: string) {
    const record = await Account.get(account)

    return record
}