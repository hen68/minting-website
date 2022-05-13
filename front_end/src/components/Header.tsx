import { useEthers } from "@usedapp/core";
import { Button, makeStyles } from "@material-ui/core"
const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(4),
        display: "flex",
        justifyContent: "flex-end",
        gap: theme.spacing(1)
    }
}))

export const Header = () => {
    const { account, activateBrowserWallet, deactivate } = useEthers()
    const classes = useStyles()
    const isConnected = account !== undefined

    return (
        <div className={classes.container}>
            <div>
                {isConnected ? (
                    <Button color="primary" onClick={deactivate} variant="contained">
                        Disconnect {account.slice(0, 4)}...{account.substring(38, 42)}
                    </Button>
                ) : (
                    <Button color="primary" onClick={() => activateBrowserWallet()} variant="contained">
                        Connect
                    </Button>
                )}
            </div>
        </div>
    )
}