import BigNumber from 'bignumber.js';
import { Contract, ContractReceipt, ContractTransaction } from 'ethers';

export class NomBondingCurve {
  private bondContract: Contract;

  private bNomContract: Contract;

  private gravityContract: Contract;

  constructor(bondContract: Contract, bNomContract: Contract, gravityContract: Contract) {
    this.bondContract = bondContract;
    this.bNomContract = bNomContract;
    this.gravityContract = gravityContract;
  }

  public async bNomIncreaseAllowance(
    destinationAddress: string,
    amountAtoms: BigNumber,
    gasPriceAtoms: BigNumber
  ): Promise<[ContractReceipt, ContractTransaction]> {
    const tx: ContractTransaction = await this.bNomContract.increaseAllowance(
      destinationAddress,
      amountAtoms.toFixed(0),
      {
        gasPrice: gasPriceAtoms.toFixed(0),
      }
    );
    const receipt = await tx.wait();
    return [receipt, tx];
  }

  public bNomIncreaseBridgeAllowance(amountAtoms: BigNumber, gasPriceAtoms: BigNumber) {
    return this.bNomIncreaseAllowance(this.gravityContract.address, amountAtoms, gasPriceAtoms);
  }

  public bNomIncreaseBondAllowance(amountAtoms: BigNumber, gasPriceAtoms: BigNumber) {
    return this.bNomIncreaseAllowance(this.bondContract.address, amountAtoms, gasPriceAtoms);
  }

  public buyQuoteETH(amountETH: BigNumber): Promise<BigNumber> {
    return this.bondContract.buyQuoteETH(amountETH.toFixed(0));
  }

  public sellQuoteNOM(amountNOM: BigNumber): Promise<BigNumber> {
    return this.bondContract.sellQuoteNOM(amountNOM.toFixed(0));
  }

  public async buyNOM(
    bidAmount: BigNumber,
    askAmount: BigNumber,
    slippage: BigNumber,
    gasPrice: BigNumber
  ) {
    const gasFeeRaw = await this.bondContract.estimateGas.buyNOM(
      askAmount.toFixed(0),
      slippage.toFixed(0),
      {
        value: bidAmount.toFixed(0),
      }
    );

    const gasFee = new BigNumber(gasFeeRaw.toString());
    // eslint-disable-next-line no-case-declarations
    const gas = gasFee.times(gasPrice);

    if (bidAmount.lt(gas)) {
      throw new Error('lowBid');
    }

    // eslint-disable-next-line no-case-declarations
    const bidAmountUpdate = bidAmount.minus(gasFee.times(gasPrice));
    // eslint-disable-next-line no-case-declarations
    const askAmountUpdateRaw = await this.bondContract.buyQuoteETH(bidAmountUpdate.toFixed(0));
    // eslint-disable-next-line no-case-declarations
    const askAmountUpdate = new BigNumber(askAmountUpdateRaw.toString());

    const tx: ContractTransaction = await this.bondContract.buyNOM(
      askAmountUpdate.toFixed(0),
      slippage.toFixed(0),
      {
        value: bidAmountUpdate.toFixed(0),
        gasPrice: gasPrice.toFixed(0),
        gasLimit: gasFee.toFixed(0),
      }
    );

    const receipt = await tx.wait();
    return [receipt, tx];
  }

  public async sellNOM(
    bidAmount: BigNumber,
    askAmount: BigNumber,
    slippage: BigNumber,
    gasPrice: BigNumber
  ) {
    const tx = await this.bondContract.sellNOM(
      bidAmount.toFixed(0),
      askAmount.toFixed(0),
      slippage.toFixed(0),
      {
        gasPrice: gasPrice.toFixed(0),
      }
    );
    const receipt = await tx.wait();
    return [receipt, tx];
  }
}
