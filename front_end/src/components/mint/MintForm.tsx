import { Token } from "../Main"
import Box from '@mui/material/Box';
import React, { useEffect, useState } from "react"
import { TabContext, TabList, TabPanel } from "@mui/lab"
import { Tab } from '@mui/material'
import { WalletBalance } from "./WalletBalance"
import { makeStyles } from "@material-ui/core"
import { useTotalSupply } from "../../hooks/useTotalSupply"
import { useMaxSupply } from "../../hooks/useMaxSupply"
import { useMaxPublicMint } from "../../hooks/useMaxPublicMint"
import { usePublicSale } from "../../hooks/usePublicSale"
import { useTotalPublicMint } from "../../hooks/useTotalPublicMint"
import { useMint } from "../../hooks/useMint"
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import RemoveIcon from '@mui/icons-material/Remove';
import { Input, CircularProgress, Snackbar } from "@material-ui/core"
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import { Alert } from "@mui/material"




interface YourWalletProps {
    supportedTokens: Array<Token>
}

const useStyles = makeStyles((theme) => ({
    tabContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(4),
        paddingTop: "2rem",
        paddingBottom: "0.3rem"
    },
    box: {
        backgroundColor: "white",
        borderRadius: "25px",
    },
    header: {
        color: "white"
    },
    span: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    mintBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing(4),
        paddingBottom: "2rem",
        justifyContent: "center"
    },
}))

export const YourWallet = ({ supportedTokens }: YourWalletProps) => {
    const { account } = useEthers()
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
    const [userMintAmount, setUserMintAmount] = useState<number>(1)
    const { notifications } = useNotifications()
    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    const { approveAndMint, mintState: approveAndMintState } = useMint()

    const handleMint = (event: React.ChangeEvent<{}>) => {
        console.log(userMintAmount)
        return approveAndMint(userMintAmount)
    }

    const isMining = approveAndMintState.status === "Mining"
    const txSignatureError = approveAndMintState.status === "Exception"
    const [mintPrice, setMintPrice] = useState<number>(0.099)
    const publicSaleLive = usePublicSale()
    const [showMintSuccess, setShowMintSuccess] = useState(false)
    const [showMintFailure, setShowMintFailure] = useState(false)
    const [showLeftToMint, setShowLeftToMint] = useState(false)
    const [showMinToMint, setShowMinToMint] = useState(false)


    const maxPublicMint = useMaxPublicMint()
    const classes = useStyles()
    const leftToMint = maxPublicMint - useTotalPublicMint(account)
    const increase = (event: React.ChangeEvent<{}>) => {
        if (userMintAmount < leftToMint) setUserMintAmount(userMintAmount + 1)
        else setShowLeftToMint(true)
    }

    const decrease = (event: React.ChangeEvent<{}>) => {
        if (userMintAmount > 1) setUserMintAmount(userMintAmount - 1)
        else setShowMinToMint(true)
    }

    const handleCloseSnack = () => {
        setShowMintSuccess(false)
        setShowMintFailure(false)
        setShowLeftToMint(false)
        setShowMinToMint(false)
    }
    useEffect(() => {
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Mint NFT").length > 0) {
            setShowMintSuccess(true)
        }
    }, [notifications])

    useEffect(() => {
        setShowMintFailure(txSignatureError)
    }, [txSignatureError])

    useEffect(() => {
        setMintPrice(userMintAmount * 0.099)
    }, [userMintAmount])

    return (
        <Box>
            {/* <h1 className={classes.header}>Mint is live!</h1> */}
            <Box className={classes.box}>
                <TabContext value={selectedTokenIndex.toString()}>

                    <p className={classes.tabContent}>{useTotalSupply()} / {useMaxSupply()} minted</p>
                    <p className={classes.tabContent}>{mintPrice} ETH</p>
                    <Box className={classes.mintBox}>
                        <Button variant="contained" onClick={increase}><AddIcon /></Button>
                        <p className={classes.span}>{userMintAmount}</p>
                        <Button variant="contained" onClick={decrease}><RemoveIcon /></Button>
                    </Box>
                    <Box className={classes.mintBox}>
                        {publicSaleLive ?
                            <Button variant="contained" onClick={handleMint}>
                                {isMining ? <CircularProgress size={26} /> : "Mint"}
                            </Button>
                            :
                            <Button variant="contained" onClick={handleMint} disabled={true}>
                                Mint soon
                            </Button>
                        }

                    </Box>

                    <Snackbar
                        open={showMintFailure}
                        autoHideDuration={5000}
                        onClose={handleCloseSnack}
                    >
                        <Alert onClose={handleCloseSnack} severity="error">
                            {approveAndMintState.errorMessage}
                        </Alert>
                    </Snackbar>

                    <Snackbar
                        open={showMintSuccess}
                        autoHideDuration={5000}
                        onClose={handleCloseSnack}
                    >
                        <Alert onClose={handleCloseSnack} severity="success">
                            Successfully minted!
                        </Alert>
                    </Snackbar>

                    <Snackbar
                        open={showLeftToMint}
                        autoHideDuration={5000}
                        onClose={handleCloseSnack}
                    >
                        <Alert onClose={handleCloseSnack} severity="info">
                            You have {leftToMint} NFTs left to mint.
                        </Alert>
                    </Snackbar>

                    <Snackbar
                        open={showMinToMint}
                        autoHideDuration={5000}
                        onClose={handleCloseSnack}
                    >
                        <Alert onClose={handleCloseSnack} severity="info">
                            You can mint minimum 1 NFT.
                        </Alert>
                    </Snackbar>

                </TabContext>
            </Box>
        </Box>

    )

}