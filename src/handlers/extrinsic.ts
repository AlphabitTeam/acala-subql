import { SubstrateExtrinsic } from '@subql/types'
import { Extrinsic } from '../types/models/Extrinsic'
import { ensureBlock } from './block';
import { getKVData } from './utils'

export async function ensureExtrinsic (extrinsic: SubstrateExtrinsic) {
  const id = extrinsic.extrinsic.hash.toString();

  let record = await Extrinsic.get(id);

  if (!record) {
    record = new Extrinsic(id);

    const block = await ensureBlock(extrinsic.block);

    record.method = extrinsic.extrinsic.method.method;
    record.section = extrinsic.extrinsic.method.section;
    record.args = getKVData(extrinsic.extrinsic.args);
    record.signerId  = extrinsic?.extrinsic?.signer?.toString()
    record.isSigned = extrinsic.extrinsic.isSigned;
    record.nonce = extrinsic.extrinsic.nonce.toBigInt();
    record.timestamp = extrinsic.block.timestamp;
    record.signature = extrinsic.extrinsic.signature.toString();
    record.tip = extrinsic.extrinsic.tip.toString();
    record.blockId = block.id;
  }

  return record;
}
