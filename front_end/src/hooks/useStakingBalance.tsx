import { useEthers } from "@usedapp/core"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import networkMapping from "../chain-info/deployments/map.json"
import ERC20 from "../chain-info/contracts/MockERC20.json"
import { constants } from "ethers"
import { useCall } from "@usedapp/core"
import { Contract } from "@ethersproject/contracts"
import { utils } from "ethers"
import { formatUnits } from "@ethersproject/units"


export const useStakingBalance = (tokenAddress: string) => {
    const { chainId } = useEthers()
    const { abi } = TokenFarm
    const { account } = useEthers()
    const tokenFarmInterace = new utils.Interface(abi)
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterace)

    const { value, error } =
        useCall(
            {
                contract: tokenFarmContract, // instance of called contract
                method: "stakingBalance", // Method to be called
                args: [tokenAddress, account], // Method arguments - address to be checked for balance
            }
        ) ?? {};
    if (error) {
        return error
    }
    // console.log(typeof parseFloat(formatUnits(value?.[0], 18)))
    return value?.[0] ? value?.[0] : 0
    // return value?.[0]
}
