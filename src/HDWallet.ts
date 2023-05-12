import { createHash } from "node:crypto";
import { BIP32API, BIP32Factory, BIP32Interface } from "bip32";
import { mnemonicToSeed } from "bip39";
import * as ecc from "tiny-secp256k1";
import secp256k1 from "secp256k1";
import keccak256 from "keccak256";
import bs58 from "bs58";

const ADDRESS_PREFIX = "41";

export type Address = { hex: string; base58: string };

export class HDWallet {
  private readonly bip32Api: BIP32API;

  constructor(public readonly mnemonic: string) {
    this.bip32Api = BIP32Factory(ecc);
  }

  public async derive(
    accountIndex: number,
    addressIndex: number
  ): Promise<{
    privateKey: Buffer;
    publicKey: Buffer;
    address: Address;
  }> {
    const hdAccount = await this.deriveAccount(accountIndex);
    const { privateKey, publicKey } = await hdAccount.derivePath(
      `0/${addressIndex}`
    );

    if (!privateKey) throw new Error("Cannot derive private key");

    const decompressedPubKey = secp256k1.publicKeyConvert(publicKey, false);
    return {
      privateKey,
      publicKey,
      address: this.calculateAddressFromDecompressedPubKey(
        Buffer.from(decompressedPubKey)
      ),
    };
  }

  private async deriveRoot(): Promise<BIP32Interface> {
    const seed = await mnemonicToSeed(this.mnemonic);
    return this.bip32Api.fromSeed(seed);
  }

  private async deriveAccount(accountIndex: number): Promise<BIP32Interface> {
    const hdRoot = await this.deriveRoot();
    return hdRoot.derivePath(`m/44'/195'/${accountIndex}'`);
  }

  private calculateAddressFromDecompressedPubKey(pubKey: Buffer): Address {
    if (pubKey.length === 65) pubKey = pubKey.subarray(1);

    let hash = keccak256(pubKey).toString("hex");
    let addressHex = ADDRESS_PREFIX + hash.substring(24);
    hash = this.sha256(this.sha256(addressHex));

    const checkSum = hash.slice(0, 8);

    return {
      hex: addressHex,
      base58: bs58.encode(Buffer.from(addressHex + checkSum, "hex")),
    };
  }

  private sha256(msg: string): string {
    return createHash("sha256").update(Buffer.from(msg, "hex")).digest("hex");
  }
}
