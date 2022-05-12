import { Token } from "../Main"
import { useStakingBalance } from "../../hooks/useStakingBalance"
import { formatUnits } from "@ethersproject/units"
import { BalanceMsg } from "../../components/BalanceMsg"

export interface StakingBalanceProps {
    token: Token
}

export const StakingBalance = ({ token }: StakingBalanceProps) => {
    const { image, address, name } = token
    const tokenBalance = useStakingBalance(address)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0

    return (<BalanceMsg
        label={`Your staked ${name} balance`}
        tokenImgSrc={image}
        amount={formattedTokenBalance}
    />)
}