import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Fund } from '../wrappers/Fund';
import '@ton/test-utils';

describe('Fund', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let fund: SandboxContract<Fund>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        fund = blockchain.openContract(await Fund.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await fund.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: fund.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and fund are ready to use
    });
});
