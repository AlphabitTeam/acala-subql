import { SubstrateBlock } from "@subql/types";
import { Block } from "../types/models";

export async function ensureBlock(block: SubstrateBlock): Promise<Block> {
    const recordId = block.block.header.hash.toString();
    let data = await Block.get(recordId)
    if(!data) {
        data = new Block(recordId);
        await data.save();
    }
    return data
}

export async function createBlock(block: SubstrateBlock): Promise<void> {
    const data = await ensureBlock(block);
    data.number = block.block.header.number.toBigInt();
    data.timestamp = block.timestamp;
    //data.parentHash
    data.specVersion = block.specVersion.toString();
    //data.stateRoot
    //data.extrinsicRoot
    await data.save()
}