import { forceToCurrencyId, forceToCurrencyName, isDexShareName, mockEventRecord } from '@acala-network/sdk-core';
import { AccountId, CurrencyId, Position } from '@acala-network/types/interfaces';
import { Share } from '@open-web3/orml-types/interfaces/rewards';
import { OrmlAccountData } from '@open-web3/orml-types/interfaces/tokens';
import { AccountBalance } from "../types/models";
import { ensureAccount } from './account';
import { getToken } from './tokens';
import { EventHandler } from './types';

async function getUserBalanceRecord (account: string, token: string) {
	const key = `${account}-${token}`

	const record = await AccountBalance.get(key)

	if (!record) {
		const record = new AccountBalance(key)

		record.accountId = account
		record.tokenId = token
		record.total = BigInt(0);
        record.free = BigInt(0);
        record.reserved = BigInt(0);
        record.frozen = BigInt(0);

		await record.save()

		return record
	}

	return record
}

async function getBalance (account: string, token: CurrencyId) {
	const tokenName = forceToCurrencyName(token);
	if (tokenName === 'KAR' || tokenName === 'ACA') {
		const data = await api.query.system.account(account)
		return data.data;
	}

	const data = await api.query.tokens.accounts(account, token) as OrmlAccountData
	return data;
}



async function getDexIncentiveShare (account: string, token: CurrencyId) {
	const data = await api.query.rewards.shareAndWithdrawnReward({ DexIncentive: token }, account) as unknown as [Share, AccountBalance];

	return data[0].toString()
}

async function getLaonDeposit(account: string, token: CurrencyId) {
	const position: Position = await api.query.loans.positions(token, account) as unknown as Position

	return position.collateral.toString()
}


async function updateBalanceRecord (account: string, token: CurrencyId) {
	const record = await getUserBalanceRecord(account, forceToCurrencyName(token))

	const balance = await getBalance(account, token)
	const locks = await api.query.balances.locks(account)
	record.free = balance.free.toBigInt();
    record.reserved = balance.reserved.toBigInt();
    record.frozen = locks.reduce((frozen, current) => frozen + current.amount.toBigInt(), BigInt(0));
	await record.save() as unknown as [CurrencyId, AccountId, AccountId];
}

export const updateBalanceByTransferred: EventHandler = async ({ event, rawEvent }) => {
	const [currency, from, to] = rawEvent.event.data as unknown as [CurrencyId, AccountId, AccountId];

	const blockNumber = event.blockNumber

	await getToken(currency)
	await ensureAccount(from.toString())
	await ensureAccount(to.toString())

	const fromAccount = from.toString()
	const toAccount = to.toString()

	await updateBalanceRecord(fromAccount, currency)
	await updateBalanceRecord(toAccount, currency)
}

export const updateBalanceByDeposit: EventHandler = async ({ event, rawEvent }) => {
	const [currency, who] = rawEvent.event.data as unknown as [CurrencyId, AccountId];

	const blockNumber = event.blockNumber

	await ensureAccount(who.toString())
	await getToken(currency)

	const whoAccount = who.toString()

	await updateBalanceRecord(whoAccount, currency)
}

export const updateBalanceByWithdrawn: EventHandler = async ({ event, rawEvent }) => {
	const [currency, who] = rawEvent.event.data as unknown as [CurrencyId, AccountId];

	const blockNumber = event.blockNumber

	await getToken(currency)
	await ensureAccount(who.toString())

	const whoAccount = who.toString()

	await updateBalanceRecord(whoAccount, currency)
}

export const updateBalanceByUpdate: EventHandler = async ({ event, rawEvent }) => {
	const [currency, who] = rawEvent.event.data as unknown as [CurrencyId, AccountId];

	const blockNumber = event.blockNumber

	await getToken(currency)
	await ensureAccount(who.toString())

	const whoAccount = who.toString()

	await updateBalanceRecord(whoAccount, currency)
}