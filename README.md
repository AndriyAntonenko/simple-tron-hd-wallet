# simple-tron-hd-wallet

Simplified implementation of HD wallet for TRON

Example:

```ts
const MNEMONIC =
  "what upgrade frown humble clock elder rely short deal fluid clip rice";

const wallet = new HDWallet(MNEMONIC);
const { address, privateKey, publicKey } = await wallet.derive(0, 0);
```
