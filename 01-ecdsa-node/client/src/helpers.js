import secp from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { utf8ToBytes } from 'ethereum-cryptography/utils';

const hashMessage = (message) => {
  //   const msgUint8Array = Uint8Array.from(Buffer.from(message, 'hex'));

  //   return toHex(msgUint8Array);
  return keccak256(utf8ToBytes(message));
};

const signMessage = async (message, privateKey) => {
  const msgHash = hashMessage(message);
  const signed = await secp.sign(msgHash, privateKey, { recovered: true });

  return signed;
};

export const generateSignature = async (message, privateKey) => {
  const { signature, recovery } = await signMessage(message, privateKey);
  const signatureHex = toHex(signature);
  const recoveryBit = recovery;

  return { signatureHex, recoveryBit };
};

const recoverKey = (message, signature, recoveryBit) => {
  const msgHash = hashMessage(message);

  return secp.recoverPublicKey(msgHash, signature, recoveryBit);
};

const getAddress = (publicKey) => {
  const hash = keccak256(publicKey.slice(1));

  return hash.slice(-20);
};

// ?
const verifyMessage = (message, signature, publicKey) => {
  const msgHash = hashMessage(message);
  const sig = secp.recover(msgHash, signature);

  return sig.equals(publicKey);
};
