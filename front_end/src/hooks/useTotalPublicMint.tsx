import { useEthers } from "@usedapp/core"
import MerkleProofCollectible from "../chain-info/contracts/MerkleProofCollectible.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants } from "ethers"
import { useCall } from "@usedapp/core"
import { Contract } from "@ethersproject/contracts"
import { utils } from "ethers"


export const useTotalPublicMint = (address: string) => {
    const { chainId } = useEthers()
    const { abi } = MerkleProofCollectible
    const merkleProofAddress = chainId ? networkMapping[chainId]["MerkleProofCollectible"][0] : constants.AddressZero

    const merkleProofInterace = new utils.Interface(abi)
    const merkleProofContract = new Contract(merkleProofAddress, merkleProofInterace)
    const { value, error } =
        useCall(
            {
                contract: merkleProofContract, // instance of called contract
                method: "totalPublicMint", // Method to be called
                args: [address], // Method arguments - address to be checked for balance
            }
        ) ?? {};

    if (error) {
        return error
    }

    return value?.[0] ? value?.[0].toNumber() : 0
}
