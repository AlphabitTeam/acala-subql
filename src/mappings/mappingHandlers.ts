import { SubstrateBlock, SubstrateEvent, SubstrateExtrinsic } from '@subql/types'
import { createEvent } from '../handlers';
import { ensureBlock } from '../handlers/block';
import { ensureExtrinsic } from '../handlers/extrinsic';

export async function handleBlock(block: SubstrateBlock): Promise<void> {
    await ensureBlock(block);
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
    await createEvent(event)
}

export async function handleExtrinsic(extrinsic: SubstrateExtrinsic): Promise<void> {
    await ensureExtrinsic(extrinsic);
}