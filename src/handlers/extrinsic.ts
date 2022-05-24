import { SubstrateExtrinsic } from "@subql/types";
import { Extrinsic } from "../types/models";
import { ensureAccount } from "./account";
import { ensureBlock } from "./block";
import { getKVData } from "./utils";

export async function ensureExtrinsic(extrinsic: SubstrateExtrinsic): Promise<Extrinsic> {
    const idx = extrinsic.idx;
    const recordId = `${extrinsic.block.block.header.number}-${idx}`
    let data = await Extrinsic.get(recordId);
    if(!data) {
        data = new Extrinsic(recordId);
        await data.save()
    }
    return data;
}

export async function createExtrinsic(extrinsic: SubstrateExtrinsic) {
    const data = await ensureExtrinsic(extrinsic);

    data.method = extrinsic.extrinsic.method.method;
    data.section = extrinsic.extrinsic.method.section;
    data.args = getKVData(extrinsic.extrinsic.args, extrinsic.extrinsic.argsDef);
    //const signer = ensureAccount(extrinsic.extrinsic.signer)
    data.nonce = extrinsic.extrinsic.nonce.toBigInt();
    data.timestamp = extrinsic.block.timestamp;
    data.signature = extrinsic.extrinsic.signature.toString();
    data.tip = extrinsic.extrinsic.tip.toString();
    data.isSigned = extrinsic.extrinsic.isSigned;
    data.isSuccess = extrinsic.success;
    const block = await ensureBlock(extrinsic.block);
    data.blockId = block.id;
}