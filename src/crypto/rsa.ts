import NodeRSA from "node-rsa";

export type RsaKeyPair = {
  publicKey: string;
  privateKey: string;
};

export const generateKeyPair = (keySize = 1024): RsaKeyPair => {
  const key = new NodeRSA({ b: keySize });
  key.setOptions({ encryptionScheme: "pkcs1" });
  return {
    publicKey: key.exportKey("pkcs8-public-pem"),
    privateKey: key.exportKey("pkcs8-private-pem"),
  };
};

export const signPayload = (payload: unknown, privateKey: string): string => {
  const signer = new NodeRSA(privateKey);
  signer.setOptions({ encryptionScheme: "pkcs1" });
  return signer.sign(JSON.stringify(payload), "base64", "utf8");
};

export const verifyPayload = (
  payload: unknown,
  signature: string,
  publicKey: string
): boolean => {
  const verifier = new NodeRSA(publicKey);
  verifier.setOptions({ encryptionScheme: "pkcs1" });
  return verifier.verify(JSON.stringify(payload), signature, "utf8", "base64");
};

export const encryptWithPublicKey = (plaintext: string, publicKey: string): string => {
  const key = new NodeRSA(publicKey);
  key.setOptions({ encryptionScheme: "pkcs1" });
  return key.encrypt(plaintext, "base64");
};

export const decryptWithPrivateKey = (ciphertext: string, privateKey: string): string => {
  const key = new NodeRSA(privateKey);
  key.setOptions({ encryptionScheme: "pkcs1" });
  return key.decrypt(ciphertext, "utf8");
};
