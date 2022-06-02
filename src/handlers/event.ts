import { SubstrateEvent } from "@subql/types";
import { Dispatcher } from "./utils/dispatcher";
import { Event } from "../types/models";
import { getKVData } from "./utils";
import { DispatchedEventData } from "./types";
import {
  createTransferInCurrencies,
} from "./history";
import {
  updateBalanceByUpdate,
  updateBalanceByWithdrawn,
  updateBalanceByTransferred,
  updateBalanceByDeposit
} from './balance'

const dispatch = new Dispatcher<DispatchedEventData>();

dispatch.batchRegist([
  { key: 'currencies-Transferred', handler: createTransferInCurrencies },
  { key: 'currencies-BalanceUpdated', handler: updateBalanceByUpdate },
  { key: 'currencies-Deposited', handler: updateBalanceByDeposit },
  { key: 'currencies-Withdrawn', handler: updateBalanceByWithdrawn },
  { key: 'currencies-Transferred', handler: updateBalanceByTransferred },
]);

export async function ensureEvnet(event: SubstrateEvent) {
  const idx = event.idx;
  const recordId = `${event.block.block.header.number}-${idx}`;

  let data = await Event.get(recordId);

  if (!data) {
    data = new Event(recordId);
    data.index = idx;
    data.blockNumber = event.block.block.header.number.toBigInt();
    data.timestamp = event.block.timestamp;

    await data.save();
  }

  return data;
}

export async function createEvent(event: SubstrateEvent) {
  const data = await ensureEvnet(event);

  const section = event.event.section;
  const method = event.event.method;
  const eventData = getKVData(event.event.data);

  data.section = section;
  data.method = method;
  data.data = eventData;

  await dispatch.dispatch(`${section}-${data.method}`, {
    event: data,
    rawEvent: event,
  });

  await data.save();

  return data;
}
