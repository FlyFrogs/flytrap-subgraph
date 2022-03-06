import {
  TransferSingle as TransferSingleEvent,
  TransferBatch as TransferBatchEvent,
  Token as TokenContract
} from '../generated/Token/Token'

// discord support:
// https://discord.com/channels/438038660412342282/438070183794573313/950101764219232326

import {
  Account
  } from '../generated/schema'

  import { BigInt } from '@graphprotocol/graph-ts';
  import { log } from '@graphprotocol/graph-ts'

  // single example:
  // https://polygonscan.com/tx/0xc874615e9b94c2f6caecfa4a2aa3bccde919909380459b9570858eee28e185ac#eventlog
  export function handleTransferSingle(event: TransferSingleEvent): void {
    let accountTo = Account.load(event.params.to.toHexString())
    if (!accountTo) {
      accountTo = new Account(event.params.to.toHexString());
    }
    let accountFrom = Account.load(event.params.from.toHexString())
    if (!accountFrom) {
      accountFrom = new Account(event.params.from.toHexString());
    }
    
    const id = event.params.id;
    if (id.isZero()) {
      accountTo.flyBalance = accountTo.flyBalance.plus(event.params.value);
      accountFrom.flyBalance = accountFrom.flyBalance.minus(event.params.value);
    }
    
    accountTo.save();
    accountFrom.save();
  }

  // batch example:
  // https://polygonscan.com/tx/0x37c4831f7496495062d4c3a979b00b8e90c3ff864ed5a5025fb8a63b2f908b3c#eventlog
  export function handleTransferBatch(event: TransferBatchEvent): void {
    let accountTo = Account.load(event.params.to.toHexString())
    if (!accountTo) {
      accountTo = new Account(event.params.to.toHexString());
    }
    let accountFrom = Account.load(event.params.from.toHexString())
    if (!accountFrom) {
      accountFrom = new Account(event.params.from.toHexString());
    }

    const ids = event.params.ids;
    const values = event.params.values;
    for (let i=0; i<ids.length; i++) {
      if (ids[i].isZero()) {
        accountTo.flyBalance = accountTo.flyBalance.plus(values[i])
        accountFrom.flyBalance = accountFrom.flyBalance.minus(values[i])
      }
    }
    accountTo.save();
    accountFrom.save();
  }