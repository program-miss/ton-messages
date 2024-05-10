import { toNano } from '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import '@ton/test-utils';
import { BulkAdder } from '../wrappers/BulkAdder';
import { Counter } from '../wrappers/Counter';

describe('BulkAdder and Counter', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let bulkAdder: SandboxContract<BulkAdder>;
    let counter: SandboxContract<Counter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        bulkAdder = blockchain.openContract(await BulkAdder.fromInit());
        counter = blockchain.openContract(await Counter.fromInit(1n));

        deployer = await blockchain.treasury('deployer');

        const deployResultBulkAdder = await bulkAdder.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        const deployResultCounter = await counter.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(deployResultBulkAdder.transactions).toHaveTransaction({
            from: deployer.address,
            to: bulkAdder.address,
            deploy: true,
            success: true,
        });

        expect(deployResultCounter.transactions).toHaveTransaction({
            from: deployer.address,
            to: counter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and bulkAdder are ready to use
    });

    it('should increase to target', async () => {
        // 30n - ошибка (из-за кол-ва газа 0.2)
        // газа 0.2 хватает только на 11n (11 полных циклов)
        const target = 5n;
        const res = await bulkAdder.send(
            deployer.getSender(),
            {
                value: toNano('0.2'),
            },
            {
                target,
                $$type: 'Reach',
                counter: counter.address,
            },
        );

        const count = await counter.getCounter();
        expect(count).toEqual(target);
    });
});
