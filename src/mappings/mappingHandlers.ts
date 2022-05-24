import { SubstrateBlock, SubstrateEvent, SubstrateExtrinsic } from '@subql/types'
import { createEvent } from '../handlers';
import { createBlock } from '../handlers/block';
import { createExtrinsic } from '../handlers/extrinsic';

export async function handleBlock(block: SubstrateBlock): Promise<void> {
    await createBlock(block);
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
    await createEvent(event)
}

export async function handleExtrinsic(extrinsic: SubstrateExtrinsic): Promise<void> {
    await createExtrinsic(extrinsic);
}