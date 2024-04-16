import { decryptWithPrivateKey, encryptWithPublicKey, generateKeyPair, signPayload, verifyPayload } from "../crypto/rsa";
import { decryptWalletToken, encryptWalletToken } from "../crypto/walletCtr";
import { TokenLedger } from "../ledger/tokenLedger";

const run = () => {
  const walletId = "smoke-wallet-001";
  const tokenSecret = "demo-token";
  const ciphertext = encryptWalletToken(tokenSecret, walletId);
  const plaintext = decryptWalletToken(ciphertext, walletId);

  const keypair = generateKeyPair();
  const envelope = encryptWithPublicKey("hello wallet courier", keypair.publicKey);
  const opened = decryptWithPrivateKey(envelope, keypair.privateKey);

  const signature = signPayload({ walletId, plaintext }, keypair.privateKey);
  const verified = verifyPayload({ walletId, plaintext }, signature, keypair.publicKey);

  const ledger = new TokenLedger<{ subject: string }>();
  ledger.append({ subject: "token-inbox-check" }, walletId);

  return {
    ciphertext,
    plaintext,
    opened,
    verified,
    ledgerHealthy: ledger.validate(),
  };
};

if (require.main === module) {
  const result = run();
  console.log(result);
}

export default run;
