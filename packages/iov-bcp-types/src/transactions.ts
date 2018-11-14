import Long from "long";
import { As } from "type-tagger";

import { ChainId, PublicKeyBundle } from "@iov/tendermint-types";

import { Address, SignableBytes } from "./signables";
import { read } from "fs-extra";
import { Session } from "inspector";

export type Nonce = Long & As<"nonce">;

// TODO: can't we just make this a number (block height?)
export type TtlBytes = Uint8Array & As<"ttl">;

// TokenTicker should be 3-4 letters, uppercase
export type TokenTicker = string & As<"token-ticker">;

export type SwapIdBytes = Uint8Array & As<"swap-id">;
export type SwapIdString = string & As<"swap-id">;

// TODO: we may want to make this a union type BNSName | PublicKey | Address
// but waiting on clarity on BNS spec, for now simplest working solution...
export type RecipientId = Address;

export interface FungibleToken {
  readonly whole: number;
  readonly fractional: number;
  readonly tokenTicker: TokenTicker;
}
// sentinel message type declaration 
export interface RegisterVpn {
  readonly Ip: string;
  readonly UploadSpeed: number;
  readonly PricePerGb: FungibleToken;
  readonly EncryptionMethod: string;
  readonly Latitude: number;
  readonly Longitude: number;
  readonly City: string;
  readonly Country: string;
  readonly NodeType: string;
  readonly Version: string;
  readonly Localaccount: string;
  readonly Password: string;
  readonly Gas: number;
}

export interface DeleteVpnUser {
  readonly address: Address;
  readonly name: string;
  readonly password: string;
  readonly gas: number;
}

export interface RegisterMasterNode {
  readonly name: string;
  readonly gas: number;
  readonly password: string;
}
export interface DeleteMasterNode {
  readonly address: Address;
  readonly name: string;
  readonly password: string;
  readonly gas: number;
}
export interface PayVpnService {
  readonly coins: FungibleToken;
  readonly Vpnaddr: Address;
  readonly Localaccount: string;
  readonly password: string;
  readonly gas: number;
  readonly SigName: string;
  readonly SigPassword: string;
}
export interface GetVpnPayment {
  readonly coins: FungibleToken;
  readonly SessionId: number;
  readonly Counter: number;
  readonly Localaccount: string;
  readonly Gas: number;
  readonly IsFinal: 0;
  readonly Password: string;
  readonly Signature: string;
}
export interface Refund {
  readonly name: string;
  readonly password: string;
  readonly SessionId: SessionID;
  readonly gas: number;
}
export interface SignToVpn {
  readonly coins: FungibleToken;
  readonly address: RecipientId;
  readonly SessionId: SessionID;
  readonly from: Address;

}
export interface SentSession {
  readonly LockedCoins: FungibleToken;
  readonly ReleasedCoins: FungibleToken;
  readonly Counter: number;
  readonly Timestamp: string;
  readonly VpnPubKey: PublicKeyBundle;
  readonly CPubKey: PublicKeyBundle;
  readonly CAddress: Address;
  readonly status: 0;

}
export const SessionId = (SessionObj: SentSession): string => {
  return SessionObj.Counter + SessionObj.CPubKey;
}

export interface SessionID {
  readonly Sessionid: string;
  readonly SessionObj: SentSession;
}
export enum TransactionKind {
  Sentinel,
  Send,
  SetName,
  SwapOffer,
  SwapCounter,
  SwapClaim,
  SwapTimeout,
}
export interface BaseTx {
  readonly chainId: ChainId;
  readonly fee?: FungibleToken;
  // signer needs to be a PublicKey as we use that to as an identifier to the Keyring for lookup
  readonly signer: PublicKeyBundle;
  readonly ttl?: TtlBytes;
}
//Sentinel trasnaction kind 

export interface RegVpnTx extends BaseTx {
  readonly recipient: RecipientId;
  readonly kind: TransactionKind.Sentinel;
  readonly VpnDetails: RegisterVpn;
}
export interface RegMastNodeTx extends BaseTx {
  readonly recipient: RecipientId;
  readonly kind: TransactionKind.Sentinel;
  readonly NodeDetails: RegisterMasterNode;
}

export interface PayVpnServiceTx extends BaseTx {
  readonly recipient: RecipientId;
  readonly kind: TransactionKind.Send;
  readonly PayType: PayVpnService;
}
export interface RefundTx extends BaseTx {
  readonly recipient: RecipientId;
  readonly kind: TransactionKind.Sentinel;
  readonly RefundType: Refund;
}

export interface SendTx extends BaseTx {
  readonly kind: TransactionKind.Send;
  readonly amount: FungibleToken;
  readonly recipient: RecipientId;
  readonly memo?: string;
}


export interface SetNameTx extends BaseTx {
  readonly kind: TransactionKind.SetName;
  readonly name: string;
}

export interface SwapOfferTx extends BaseTx {
  readonly kind: TransactionKind.SwapOffer;
  readonly amount: ReadonlyArray<FungibleToken>;
  readonly recipient: RecipientId;
  readonly timeout: number; // number of blocks in the future
  readonly preimage: Uint8Array;
}

export interface SwapCounterTx extends BaseTx {
  readonly kind: TransactionKind.SwapCounter;
  readonly amount: ReadonlyArray<FungibleToken>;
  readonly recipient: RecipientId;
  readonly timeout: number; // number of blocks in the future
  readonly hashCode: Uint8Array; // pulled from the offer transaction
}

export interface SwapClaimTx extends BaseTx {
  readonly kind: TransactionKind.SwapClaim;
  readonly preimage: Uint8Array;
  readonly swapId: SwapIdBytes; // pulled from the offer transaction
}

export interface SwapTimeoutTx extends BaseTx {
  readonly kind: TransactionKind.SwapTimeout;
  readonly swapId: SwapIdBytes; // pulled from the offer transaction
}

export type UnsignedTransaction =
  | RegVpnTx
  | RegMastNodeTx
  | RefundTx
  | PayVpnServiceTx
  | SendTx
  | SetNameTx
  | SwapOfferTx
  | SwapCounterTx
  | SwapClaimTx
  | SwapTimeoutTx;
