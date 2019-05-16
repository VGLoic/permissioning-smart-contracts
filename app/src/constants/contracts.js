import Rules from "../contracts/Rules.json";
import Admin from "../contracts/Admin.json";

export const rulesConfig = eth => ({
    contractName: "Rules",
    web3Contract: new eth.Contract(Rules)
});

export const adminConfig = eth => ({
    contractName: "Admin",
    web3Contract: new eth.Contract(Admin)
});
