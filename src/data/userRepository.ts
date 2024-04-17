import { randomUUID } from "crypto";
import { decryptWalletToken, encryptWalletToken } from "../crypto/walletCtr";
import { JsonFileStore } from "../lib/fileStore";

const store = new JsonFileStore<EncryptedUserRecord[]>("data/users.json");

export type WalletUserProfile = {
  id: string;
  username: string;
  password: string;
  walletAddress: string;
  publicKey: string;
  privateKey: string;
  createdAt: number;
};

type EncryptedUserRecord = {
  id: string;
  walletSalt: string;
  username: string;
  password: string;
  walletAddress: string;
  publicKey: string;
  privateKey: string;
  createdAt: number;
};

const toEncrypted = (profile: WalletUserProfile): EncryptedUserRecord => {
  const walletSalt = profile.id;
  // AES-CTR wraps each wallet/token attribute to keep local JSON safe without dropping wallet semantics.
  return {
    id: profile.id,
    walletSalt,
    username: encryptWalletToken(profile.username, walletSalt),
    password: encryptWalletToken(profile.password, walletSalt),
    walletAddress: encryptWalletToken(profile.walletAddress, walletSalt),
    publicKey: encryptWalletToken(profile.publicKey, walletSalt),
    privateKey: encryptWalletToken(profile.privateKey, walletSalt),
    createdAt: profile.createdAt,
  };
};

const fromEncrypted = (record: EncryptedUserRecord): WalletUserProfile => {
  const walletId = record.walletSalt;
  return {
    id: record.id,
    username: decryptWalletToken(record.username, walletId),
    password: decryptWalletToken(record.password, walletId),
    walletAddress: decryptWalletToken(record.walletAddress, walletId),
    publicKey: decryptWalletToken(record.publicKey, walletId),
    privateKey: decryptWalletToken(record.privateKey, walletId),
    createdAt: record.createdAt,
  };
};

export const listUsers = async (): Promise<WalletUserProfile[]> => {
  const encrypted = await store.read([]);
  return encrypted.map(fromEncrypted);
};

export const findUserByUsername = async (username: string) => {
  const users = await listUsers();
  return users.find((user) => user.username === username) ?? null;
};

export const findUserByWallet = async (walletAddress: string) => {
  const users = await listUsers();
  return users.find((user) => user.walletAddress === walletAddress) ?? null;
};

export const saveUser = async (input: Omit<WalletUserProfile, "id" | "createdAt">) => {
  const id = randomUUID();
  const profile: WalletUserProfile = {
    id,
    createdAt: Date.now(),
    ...input,
  };
  const encryptedUsers = await store.read([]);
  encryptedUsers.push(toEncrypted(profile));
  await store.write(encryptedUsers);
  return profile;
};
