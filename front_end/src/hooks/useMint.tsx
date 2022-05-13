import { useContractFunction, useEthers } from "@usedapp/core"
import MerkleProofCollectible from "../chain-info/contracts/MerkleProofCollectible.json"
import networkMapping from "../chain-info/deployments/map.json"
import { useEffect } from "react"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import { useState } from "react"


export const useMint = () => {
    const { chainId } = useEthers()
    const { abi } = MerkleProofCollectible
    const { account } = useEthers()
    const merkleProofAddress = chainId ? networkMapping[String(chainId)]["MerkleProofCollectible"][0] : constants.AddressZero
    const merkleProofInterface = new utils.Interface(abi)
    const merkleProofContract = new Contract(merkleProofAddress, merkleProofInterface)


    const { send: mint, state: mintState } = useContractFunction(merkleProofContract, "mint", {
        transactionName: "Mint NFT"
    })

    const approveAndMint = (amount: number) => {
        return mint(amount, { value: utils.parseEther(String(amount * 0.099)) })
    }
    // const { send: approveErc20Send, state: approveAndStakeErc20State } =
    //     useContractFunction(erc20Contract, "approve", {
    //         transactionName: "Approve ERC20 transfer"
    //     })

    // const approveAndStake = (amount: string) => {
    //     setAmountToStake(amount)
    //     return approveErc20Send(tokenFarmAddress, amount)
    // }
    // const { send: stakeSend, state: stakeState } =
    //     useContractFunction(tokenFarmContract, "stakeTokens", {
    //         transactionName: "Stake Tokens"
    //     })


    // const [amountToStake, setAmountToStake] = useState("0")

    // useEffect(() => {
    //     if (approveAndStakeErc20State.status === "Success") {
    //         stakeSend(amountToStake, tokenAddress)
    //     }
    // }, [approveAndStakeErc20State, amountToStake, tokenAddress])

    // const [state, setState] = useState(approveAndStakeErc20State)

    // useEffect(() => {
    //     if (approveAndStakeErc20State.status === "Success") {
    //         setState(stakeState)
    //     } else {
    //         setState(approveAndStakeErc20State)
    //     }
    // }, [approveAndStakeErc20State, stakeState])
    // return { approveAndStake, state }

    return { approveAndMint, mintState }
}