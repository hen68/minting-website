import { useEthers } from "@usedapp/core"
import MerkleProofCollectible from "../chain-info/contracts/MerkleProofCollectible.json"
import networkMapping from "../chain-info/deployments/map.json"
import ERC20 from "../chain-info/contracts/MockERC20.json"
import { constants } from "ethers"
import { useCall } from "@usedapp/core"
import { Contract } from "@ethersproject/contracts"
import { utils } from "ethers"
import { formatUnits } from "@ethersproject/units"


export const useTotalSupply = () => {
    const { chainId } = useEthers()
    const { abi } = MerkleProofCollectible
    const { account } = useEthers()
    const merkleProofAddress = chainId ? networkMapping[chainId]["MerkleProofCollectible"][0] : constants.AddressZero

    const merkleProofInterace = new utils.Interface(abi)
    const merkleProofContract = new Contract(merkleProofAddress, merkleProofInterace)
    const { value, error } =
        useCall(
            {
                contract: merkleProofContract, // instance of called contract
                method: "totalSupply", // Method to be called
                args: [], // Method arguments - address to be checked for balance
            }
        ) ?? {};

    if (error) {
        console.log("")
        return error
    }

    return value
}
