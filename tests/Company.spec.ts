import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Company } from '../wrappers/Company';
import '@ton/test-utils';

describe('Company', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let company: SandboxContract<Company>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        company = blockchain.openContract(await Company.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await company.send(
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
            to: company.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and company are ready to use
    });
});
