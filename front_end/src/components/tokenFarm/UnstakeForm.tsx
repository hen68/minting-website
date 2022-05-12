import { useUnstakeTokens } from "../../hooks/useUnstakeTokens"
import { Button, CircularProgress, Snackbar } from "@material-ui/core"
import { Token } from "../Main"

export interface UnstakeProps {
    token: Token
}

export const UnstakeForm = ({ token }: UnstakeProps) => {
    const { image, address, name } = token
    const { send: unstakeToken, state: unstakeTokenState } = useUnstakeTokens()

    const handleUnstakeSubmit = () => {
        unstakeToken(address)
    }
    let isMining = unstakeTokenState.status === "Mining"
    return (
        <div>
            <Button onClick={handleUnstakeSubmit} color="primary" size="large" disabled={isMining}>
                {isMining ? <CircularProgress size={26} /> : "Unstake all"}
            </Button>
        </div>
    )
}