import { test, expect } from "bun:test";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { COUNTER_SIZE, schema } from "./types";
import * as borsh from "borsh";

let adminAccount = Keypair.generate();
let dataAccount = Keypair.generate();

const PROGRAM_ID = new PublicKey("CYDCfLRuuMad6Rfy4hN1CePanGK4hkGyx5xMAesWxeiC");

test("Account info is initialized", async () => {
    const connection = new Connection("http://127.0.0.1:8899");
    const txn = await connection.requestAirdrop(adminAccount.publicKey, 1000_000_000);
    await connection.confirmTransaction(txn);
    const data = await connection.getAccountInfo(adminAccount.publicKey);
    
    //airdrop to user account done

    const lamports = await connection.getMinimumBalanceForRentExemption(COUNTER_SIZE);

    const ix = SystemProgram.createAccount({
        fromPubkey: adminAccount.publicKey,
        lamports: lamports,
        space: COUNTER_SIZE,
        programId: PROGRAM_ID,
        newAccountPubkey: dataAccount.publicKey,
    });

    const createAccountTxn = new Transaction();
    createAccountTxn.add(ix);

    const signature = await connection.sendTransaction(createAccountTxn, [adminAccount, dataAccount]);
    await connection.confirmTransaction(signature);

    console.log("Data account created", dataAccount.publicKey.toBase58());

    const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);
    const counter = borsh.deserialize(schema, dataAccountInfo?.data!);
    console.log("Counter", counter);
    expect(counter).toBe(0);
});

