import Box from '@mui/material/Box';
import { useEthers, useEtherBalance } from "@usedapp/core";
import { formatEther } from '@ethersproject/units'

import { Button, makeStyles } from "@material-ui/core"
import { useEffect } from 'react';
const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(4),
        display: "flex",
        justifyContent: "flex-end",
        gap: theme.spacing(1)
    },
    span: {
        color: "white",
        padding: "1rem"
    }
}))

export const Header = () => {
    const { account, activateBrowserWallet, deactivate } = useEthers()
    const classes = useStyles()
    const isConnected = account !== undefined
    const etherBalance = useEtherBalance(account)

    return (
        <div className={classes.container}>
            <div>
                {isConnected ? (
                    <Box>
                        <span className={classes.span}>{formatEther(etherBalance).slice(0, 6)} Ξ</span>
                        <Button color="primary" onClick={deactivate} variant="contained">
                            Disconnect ({account.slice(0, 4)}...{account.substring(38, 42)})
                        </Button>
                    </Box>

                ) : (
                    <Button color="primary" onClick={() => activateBrowserWallet()} variant="contained">
                        Connect
                    </Button>
                )}
            </div>
        </div>
    )
}