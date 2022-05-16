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
import { useWhitelistSale } from "../../hooks/useWhitelistSale"
import { useMint } from "../../hooks/useMint"
import { useWhitelistMint } from "../../hooks/useWhitelistMint"
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import RemoveIcon from '@mui/icons-material/Remove';
import { Input, CircularProgress, Snackbar } from "@material-ui/core"
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import { Alert } from "@mui/material"
import { backendLookup } from "../../lookup/components"




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
    disconnected: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "6rem",
        paddingBottom: "6rem"
    }
}))

export const YourWallet = ({ supportedTokens }: YourWalletProps) => {
    const { account } = useEthers()
    const classes = useStyles()
    const [eligibleForWhitelistMint, setEligibleForWhitelistMint] = useState(false)
    const [showMintSuccess, setShowMintSuccess] = useState(false)
    const [showMintFailure, setShowMintFailure] = useState(false)
    const [showWhitelistMintFailure, setShowWhitelistMintFailure] = useState(false)
    const [showLeftToMint, setShowLeftToMint] = useState(false)
    const [showMinToMint, setShowMinToMint] = useState(false)
    const [isConnected, setIsConnected] = useState(false)

    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
    const [userMintAmount, setUserMintAmount] = useState<number>(1)
    const [merkleProof, setMerkleProof] = useState([])

    const { notifications } = useNotifications()

    const { approveAndMint, mintState: approveAndMintState } = useMint()
    const isMining = approveAndMintState.status === "Mining"
    const txSignatureError = approveAndMintState.status === "Exception"

    const { approveAndWhitelistMint, whitelistMintState: approveAndWhitelistMintState } = useWhitelistMint()
    const isWhitelistMining = approveAndWhitelistMintState.status === "Mining"
    const txWhitelistSignatureError = approveAndWhitelistMintState.status === "Exception"

    const publicMintPrice = userMintAmount * 0.099
    const whitelistMintPrice = userMintAmount * 0.0799

    const publicSaleLive = usePublicSale()
    const whitelistSaleLive = useWhitelistSale()
    const totalMinted = useTotalSupply()
    const maxSupply = useMaxSupply()
    const maxPublicMint = useMaxPublicMint()
    const leftToMint = maxPublicMint - useTotalPublicMint(account)


    const handleMint = (event: React.ChangeEvent<{}>) => {
        console.log(merkleProof)
        return approveAndMint(userMintAmount)
    }

    const handleWhitelistMint = () => {
        return approveAndWhitelistMint(userMintAmount, merkleProof)
    }

    const getMerkleProof = (currentAccount: string) => {

        const getProofCallback = (response, status) => {
            if (response["response"] !== "Wallet not whitelisted.") {
                setMerkleProof(response["response"])
            } else {
                setMerkleProof([])
            }
        }

        backendLookup("POST", "get-proof", getProofCallback, { "wallet": currentAccount })
    }


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
        setShowWhitelistMintFailure(false)
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

        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Whitelist Mint NFT").length > 0) {
            setShowMintSuccess(true)
        }
    }, [notifications])

    useEffect(() => {
        setShowMintFailure(txSignatureError)
    }, [txSignatureError])

    useEffect(() => {
        setShowWhitelistMintFailure(txWhitelistSignatureError)
    }, [txWhitelistSignatureError])

    useEffect(() => {
        if (account !== undefined) {
            setIsConnected(true)
            if (whitelistSaleLive) {
                getMerkleProof(account)
            }

        } else {
            setIsConnected(false)
            setMerkleProof([])
        }
    }, [account])

    useEffect(() => {
        if (merkleProof.length !== 0) setEligibleForWhitelistMint(true)
        else setEligibleForWhitelistMint(false)
    }, [merkleProof])


    return (
        <Box>
            <h1 className={classes.header}>{publicSaleLive ? "Public mint is live!" : whitelistSaleLive ? "Whitelist mint is live!" : "Mint not live yet."}</h1>
            <Box className={classes.box}>
                <TabContext value={selectedTokenIndex.toString()}>
                    {isConnected ?
                        <>
                            <p className={classes.tabContent}>{totalMinted} / {maxSupply} minted</p>
                            <p className={classes.tabContent}>{publicSaleLive ? publicMintPrice : whitelistMintPrice} ETH</p>
                            <Box className={classes.mintBox}>
                                <Button variant="contained" onClick={increase}><AddIcon /></Button>
                                <p className={classes.span}>{userMintAmount}</p>
                                <Button variant="contained" onClick={decrease}><RemoveIcon /></Button>
                            </Box>
                            <Box className={classes.mintBox}>
                                {publicSaleLive ?
                                    <Box>
                                        {totalMinted === maxSupply ?

                                            <Button variant="contained" onClick={handleMint} disabled={true}>
                                                Minted out
                                            </Button>
                                            :
                                            <Button variant="contained" onClick={handleMint}>
                                                {isMining ? <CircularProgress size={26} /> : "Mint"}
                                            </Button>
                                        }
                                    </Box>
                                    :
                                    whitelistSaleLive ?
                                        eligibleForWhitelistMint ?
                                            <Button variant="contained" onClick={handleWhitelistMint}>
                                                {isWhitelistMining ? <CircularProgress size={26} /> : "Whitelist Mint"}
                                            </Button>
                                            :
                                            <Button variant="contained" onClick={handleMint} disabled={true}>
                                                {isMining ? <CircularProgress size={26} /> : "Not Whitelisted"}
                                            </Button>
                                        :
                                        <Button variant="contained" onClick={handleMint} disabled={true}>
                                            Mint soon
                                        </Button>
                                }
                            </Box>
                        </>
                        :
                        <h2 className={classes.disconnected}>Connect to your wallet</h2>
                    }

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
                        open={showWhitelistMintFailure}
                        autoHideDuration={5000}
                        onClose={handleCloseSnack}
                    >
                        <Alert onClose={handleCloseSnack} severity="error">
                            {approveAndWhitelistMintState.errorMessage}
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