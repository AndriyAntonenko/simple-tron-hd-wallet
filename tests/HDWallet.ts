import { HDWallet } from "../src";
import { expect } from "chai";

const MNEMONIC =
  "what upgrade frown humble clock elder rely short deal fluid clip rice";

describe("HDWallet", () => {
  it("should derive pair correctly", async () => {
    const wallet = new HDWallet(MNEMONIC);
    const { address, privateKey, publicKey } = await wallet.derive(0, 0); // root address

    expect(privateKey.toString("hex")).eq(
      "becbdec72ce497a659c1425780462f899ca3e8723578974f2b044981040510f6"
    );
    expect(publicKey.toString("hex")).eq(
      "02cf04e1ce84ab79a2b04e40086e31a43a0ec498d1980154637962e72723884af0"
    );
    expect(address.base58).eq("TUhYpaVkHdLgwevNiZ5NqYYJfLDxUooF4G");
    expect(address.hex).eq("41cd744760c92e1536af312de0366d886fd9011681");
  });
});
