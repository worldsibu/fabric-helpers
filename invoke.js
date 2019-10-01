// tslint:disable:max-line-length
const wshelper = require('@worldsibu/convector-common-fabric-helper');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const d = require('debug')('forma:helper');

const homedir = require('os').homedir();

const user = process.env.USERNAME;
const chaincode = process.argv[2];
const fcn = process.argv[3];
const transientData = process.argv[4];
const args = process.argv.slice(5);
const keyStore = path.resolve(__dirname, process.env.KEYSTORE);
const networkProfile = path.resolve(__dirname, process.env.NETWORKPROFILE);
const channel = process.env.CHANNEL;
d(`KEYSTORE=${keyStore}`);
d(`NETWORKPROFILE=${networkProfile}`);
d(`USER=${user}`);
d(`CHAINCODE=${chaincode}`);
d(`FUNCTION=${fcn}`);
d(`CHANNEL=${channel}`);
d(`transientData=${transientData}`);


let helper = new wshelper.ClientHelper({
    channel: channel,
    skipInit: true,
    user: user,
    keyStore: keyStore,
    networkProfile: networkProfile,
    txTimeout: 300000
});

d('Sending transaction...');
helper.init().then(async () => {

    try {
        await helper.useUser(user || 'user1');

        const { proposalResponse } = await helper.sendTransactionProposal({
            fcn: fcn,
            chaincodeId: chaincode,
            args: args || [],
            // args: ['marble1'],
            // transientMap: {
            //     "marble":
            //         "eyJuYW1lIjoibWFyYmxlMSIsImNvbG9yIjoiYmx1ZSIsInNpemUiOjM1LCJvd25lciI6InRvbSIsInByaWNlIjo5OX0="
            // }
        }, true);

        res = await helper.processProposal(proposalResponse);

        d(`Transaction sent! ${res.code} ${res.info} ${res.status} ${res.txId}`);
        d(`Result: ${JSON.stringify(res.result)}`);

        // res = await helper.invoke(this.options.function, this.options.name, this.options.user, ...this.options.params);

    } catch (ex) {
        if (ex.responses) {
            if (ex.responses.filter(response => !response.isProposalResponse).length === 0) {
                d(`No peer ran tx successfully!`);
                d(ex.responses);
                d(ex);
                return;
            }
            d(`At least one peer returned an error!`);
            d(`This may happen when a transaction queries private data that's not accessible to all peers`);
            ex.responses.map(response => {
                d(`Response from ${response.peer.name}`);
                if (response.isProposalResponse) {
                    d(JSON.stringify(response));
                } else {
                    // Good response
                    d(response.response.payload.toString('utf8'));
                }
            });
        } else {
            d(`Errors found!`);
            console.log(ex);
            d(ex);
        }
    }
});
