import {
  forceToCurrencyName,
  MaybeCurrency,
  isDexShareName,
  unzipDexShareName
} from "@acala-network/sdk-core";
import { Token } from "../types/models";

let tokenDecimalMap: Map<string, number>;

function getDecimal(token: string) {
  return tokenDecimalMap.get(token) || 10;
}

// get token 
export async function getToken(currency: MaybeCurrency) {
  const tokenName = forceToCurrencyName(currency);

  let token = await Token.get(tokenName);

  if (!token) {
    // create token if the token doesn't exits
    token = new Token(tokenName);

    // build the token decimal map
    if (!tokenDecimalMap) {
      const tokens = api.registry.chainTokens;
      const decimals = api.registry.chainDecimals;

      tokenDecimalMap = new Map<string, number>(
        tokens.map((item, index) => [item, decimals[index]])
      );
    }

    let decimal = 10;

    // TODO: handle erc20
    const isDexShareToken = isDexShareName(tokenName);

    // trade dex share decimal as token0 decimal
    if (isDexShareToken) {
      const [token0, token1] = unzipDexShareName(tokenName);
      const decimal0 = getDecimal(token0) || getDecimal(token1);

      decimal = decimal0;
    } else {
      decimal = getDecimal(tokenName);
    }

    token.decimal = decimal;
    token.name = tokenName;

    token.price = '0'

    token.issuance = '0'
    token.lockedInDex = '0'
    token.lockedInIncentive = '0'
    token.lockedInLoan = '0'
    token.volume = '0'
    token.volumeUSD = '0'
    token.txCount = BigInt(0)

    await token.save();
  }

  return token;
}

export async function initSystemTokens() {
  const tokens = api.registry.chainTokens;

  // ensure that all basic tokens are created
  await Promise.all(tokens.map((symbol) => getToken(symbol)));
}