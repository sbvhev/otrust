import BigNumber from 'bignumber.js';
import { Contract, ContractReceipt, ContractTransaction } from 'ethers';

function convertBigNum(bigNum: BigNumber) {
  // Needed due to mixed BigNumber versions
  return new BigNumber(bigNum.toString());
}

export class NomBondingCurve {
  private bondContract: Contract;

  private bNomContract: Contract;

  private gravityContract: Contract;

  constructor(bondContract: Contract, bNomContract: Contract, gravityContract: Contract) {
    this.bondContract = bondContract;
    this.bNomContract = bNomContract;
    this.gravityContract = gravityContract;
  }

  public async bNomAllowance(account: string, destinationAddress: string): Promise<BigNumber> {
    return this.bNomContract.allowance(account, destinationAddress).then(convertBigNum);
  }

  public async bNomBridgeAllowance(account: string) {
    return this.bNomAllowance(account, this.gravityContract.address);
  }

  public async bNomBondAllowance(account: string) {
    return this.bNomAllowance(account, this.bondContract.address);
  }

  public async bNomIncreaseAllowance(
    destinationAddress: string,
    amountAtoms: BigNumber,
    gasPriceWei: BigNumber
  ): Promise<[ContractReceipt, ContractTransaction]> {
    const tx: ContractTransaction = await this.bNomContract.increaseAllowance(
      destinationAddress,
      amountAtoms.toFixed(0),
      {
        gasPrice: gasPriceWei.toFixed(0),
      }
    );
    const receipt = await tx.wait();
    return [receipt, tx];
  }

  public bNomIncreaseBridgeAllowance(amountAtoms: BigNumber, gasPriceWei: BigNumber) {
    return this.bNomIncreaseAllowance(this.gravityContract.address, amountAtoms, gasPriceWei);
  }

  public bNomIncreaseBondAllowance(amountAtoms: BigNumber, gasPriceWei: BigNumber) {
    return this.bNomIncreaseAllowance(this.bondContract.address, amountAtoms, gasPriceWei);
  }

  public bondBuyQuoteETH(amountWei: BigNumber): Promise<BigNumber> {
    return this.bondContract.buyQuoteETH(amountWei.toFixed(0)).then(convertBigNum);
  }

  public bondSellQuoteNOM(amountAtoms: BigNumber): Promise<BigNumber> {
    return this.bondContract.sellQuoteNOM(amountAtoms.toFixed(0)).then(convertBigNum);
  }

  public async bondBuyNOM(
    bidAmountWei: BigNumber,
    askAmountAtoms: BigNumber,
    slippageAtoms: BigNumber,
    gasPriceWei: BigNumber
  ): Promise<[ContractReceipt, ContractTransaction]> {
    const gasFeeRaw = await this.bondContract.estimateGas.buyNOM(
      askAmountAtoms.toFixed(0),
      slippageAtoms.toFixed(0),
      {
        value: bidAmountWei.toFixed(0),
      }
    );

    const gasFee = new BigNumber(gasFeeRaw.toString());
    // eslint-disable-next-line no-case-declarations
    const gas = gasFee.times(gasPriceWei);

    if (bidAmountWei.lt(gas)) {
      throw new Error('lowBid');
    }

    // eslint-disable-next-line no-case-declarations
    const bidAmountUpdate = bidAmountWei.minus(gasFee.times(gasPriceWei));
    // eslint-disable-next-line no-case-declarations
    const askAmountUpdateRaw = await this.bondContract.buyQuoteETH(bidAmountUpdate.toFixed(0));
    // eslint-disable-next-line no-case-declarations
    const askAmountUpdate = new BigNumber(askAmountUpdateRaw.toString());

    const tx: ContractTransaction = await this.bondContract.buyNOM(
      askAmountUpdate.toFixed(0),
      slippageAtoms.toFixed(0),
      {
        value: bidAmountUpdate.toFixed(0),
        gasPrice: gasPriceWei.toFixed(0),
        gasLimit: gasFee.toFixed(0),
      }
    );

    const receipt = await tx.wait();
    return [receipt, tx];
  }

  public async bondSellNOM(
    bidAmountWei: BigNumber,
    askAmountAtoms: BigNumber,
    slippageAtoms: BigNumber,
    gasPriceWei: BigNumber
  ): Promise<[ContractReceipt, ContractTransaction]> {
    const tx = await this.bondContract.sellNOM(
      bidAmountWei.toFixed(0),
      askAmountAtoms.toFixed(0),
      slippageAtoms.toFixed(0),
      {
        gasPrice: gasPriceWei.toFixed(0),
      }
    );
    const receipt = await tx.wait();
    return [receipt, tx];
  }

  public async bridgeSendToCosmos(
    tokenContract: string,
    destinationAddress: string,
    amountAtoms: BigNumber,
    gasPriceWei: BigNumber
  ): Promise<[ContractReceipt, ContractTransaction]> {
    const tx = await this.gravityContract.sendToCosmos(
      tokenContract,
      destinationAddress,
      amountAtoms.toString(10),
      { gasPrice: gasPriceWei.toFixed(0) }
    );
    const receipt = await tx.wait();
    return [receipt, tx];
  }

  public async bridgeBNOMSendToCosmos(
    destinationAddress: string,
    amountAtoms: BigNumber,
    gasPriceWei: BigNumber
  ) {
    return this.bridgeSendToCosmos(
      this.bNomContract.address,
      destinationAddress,
      amountAtoms,
      gasPriceWei
    );
  }
}
