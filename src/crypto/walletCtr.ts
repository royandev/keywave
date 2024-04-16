import aesjs from "aes-js";
import { sha256 } from "js-sha256";

const DEFAULT_SEED = process.env.KEYWAVE_WALLET_SEED ?? "keywave-dev-wallet-seed";

const toBytes16 = (input: string) => Uint8Array.from(sha256.array(input).slice(0, 16));

const buildCipher = (walletId: string, seed: string = DEFAULT_SEED) => {
  const keyBytes = toBytes16(`wallet-key:${seed}`);
  const counterBytes = toBytes16(`wallet-ctr:${walletId}`);
  const counter = new (aesjs as any).Counter(counterBytes);
  return new aesjs.ModeOfOperation.ctr(keyBytes, counter);
};

export const encryptWalletToken = (
  plaintext: string,
  walletId: string,
  seed: string = DEFAULT_SEED
): string => {
  const cipher = buildCipher(walletId, seed);
  const encrypted = cipher.encrypt(aesjs.utils.utf8.toBytes(plaintext));
  return aesjs.utils.hex.fromBytes(encrypted);
};

export const decryptWalletToken = (
  cipherHex: string,
  walletId: string,
  seed: string = DEFAULT_SEED
): string => {
  const cipher = buildCipher(walletId, seed);
  const decrypted = cipher.decrypt(aesjs.utils.hex.toBytes(cipherHex));
  return aesjs.utils.utf8.fromBytes(decrypted);
};

export const deriveWalletKeyPreview = (walletId: string, seed: string = DEFAULT_SEED) =>
  sha256(`preview:${walletId}:${seed}`).slice(0, 16);
