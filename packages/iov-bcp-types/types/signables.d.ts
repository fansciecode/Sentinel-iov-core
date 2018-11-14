import { As } from "type-tagger";
import { ChainId, PostableBytes, PublicKeyBundle, SignatureBytes } from "@iov/tendermint-types";
import { Nonce, UnsignedTransaction } from "./transactions";
export declare type TransactionIdBytes = Uint8Array & As<"transaction-id">;
export declare type SignableBytes = Uint8Array & As<"signable">;
export declare enum PrehashType {
    None = 0,
    Sha512 = 1,
    Sha256 = 2
}
export interface SigningJob {
    readonly bytes: SignableBytes;
    readonly prehashType: PrehashType;
}
//Sentinel client signature type 
export interface ClientSignature extends FullSignature {
// readonly Coins :FungibleToken;
readonly SessionId :ByteString;
readonly counter :number;
readonly isfinal :1;
}
export interface FullSignature {
    readonly nonce: Nonce;
    readonly publicKey: PublicKeyBundle;
    readonly signature: SignatureBytes;
}
export interface SignedTransaction<T extends UnsignedTransaction = UnsignedTransaction> {
    readonly transaction: T;
    readonly primarySignature: FullSignature;
    readonly otherSignatures: ReadonlyArray<FullSignature>;
}
export declare type Address = Uint8Array & As<"address">;
export interface TxReadCodec {
    readonly parseBytes: (bytes: PostableBytes, chainId: ChainId) => SignedTransaction;
    readonly keyToAddress: (key: PublicKeyBundle) => Address;
}
export interface TxCodec extends TxReadCodec {
    readonly bytesToSign: (tx: UnsignedTransaction, nonce: Nonce) => SigningJob;
    readonly bytesToPost: (tx: SignedTransaction) => PostableBytes;
    readonly identifier: (tx: SignedTransaction) => TransactionIdBytes;
}
