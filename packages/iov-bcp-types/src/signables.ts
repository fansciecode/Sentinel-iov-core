import { As } from "type-tagger";

import { ChainId, PostableBytes, PublicKeyBundle, SignatureBytes } from "@iov/tendermint-types";

import { Nonce, UnsignedTransaction, FungibleToken, SentSession } from "./transactions";

export type TransactionIdBytes = Uint8Array & As<"transaction-id">;

export type SignableBytes = Uint8Array & As<"signable">;

// Specifies which hash function to apply before signing.
// The identity function is indicated using None.
export enum PrehashType {
  None,
  Sha512,
  Sha256,
}

export interface SigningJob {
  readonly bytes: SignableBytes;
  readonly prehashType: PrehashType;
}

// NB: use Buffer or String, we should be consistent....
// I figure string if this will be json dumped, but maybe less efficient
export interface FullSignature {
  readonly nonce: Nonce;
  readonly publicKey: PublicKeyBundle;
  readonly signature: SignatureBytes;
}

//Sentinel client signature type 
export interface ClientSignature extends FullSignature {
readonly Coins :FungibleToken;
readonly SessionId :ByteString;
readonly counter :number;
readonly isfinal :1;
}
// A signable transaction knows how to serialize itself
// and how to store signatures
export interface SignedTransaction<T extends UnsignedTransaction = UnsignedTransaction> {
  // transaction is the user request
  readonly transaction: T;

  readonly primarySignature: FullSignature;

  // signatures can be appended as this is signed
  readonly otherSignatures: ReadonlyArray<FullSignature>;
}

// A codec specific address
export type Address = Uint8Array & As<"address">;

export interface TxReadCodec {
  // parseBytes will recover bytes from the blockchain into a format we can use
  readonly parseBytes: (bytes: PostableBytes, chainId: ChainId) => SignedTransaction;
  // chain-dependent way to calculate address from key
  readonly keyToAddress: (key: PublicKeyBundle) => Address;
}

// TxCodec knows how to convert Transactions to bytes for a given blockchain
export interface TxCodec extends TxReadCodec {
  // these are the bytes we create to add a signature
  // they often include nonce and chainID, but not other signatures
  readonly bytesToSign: (tx: UnsignedTransaction, nonce: Nonce) => SigningJob;
  // bytesToPost includes the raw transaction appended with the various signatures
  readonly bytesToPost: (tx: SignedTransaction) => PostableBytes;
  // identifier is usually some sort of hash of bytesToPost, chain-dependent
  readonly identifier: (tx: SignedTransaction) => TransactionIdBytes;
}
