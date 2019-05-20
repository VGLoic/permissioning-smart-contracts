import Rules from "./contracts/Rules.json";
import Admin from "./contracts/Admin.json";

const options = {
    web3: {
        block: false,
        fallback: {}
    },
    contracts: [Admin, Rules],
    events: {},
    polls: {
        accounts: 1500
    }
};

export default options;
