import { Token } from "../Main"
import Box from '@mui/material/Box';
import React, { useState } from "react"
import { TabContext, TabList, TabPanel } from "@mui/lab"
import { Tab } from '@mui/material'
import { WalletBalance } from "./WalletBalance"
import { makeStyles } from "@material-ui/core"
import { useTotalSupply } from "../../hooks/useTotalSupply"
import { useMaxSupply } from "../../hooks/useMaxSupply"
import { useMaxPublicMint } from "../../hooks/useMaxPublicMint"
import { useMint } from "../../hooks/useMint"
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import RemoveIcon from '@mui/icons-material/Remove';
import { CircularProgress } from "@material-ui/core"




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
        paddingBottom: "2rem"
    },
    box: {
        backgroundColor: "white",
        borderRadius: "25px",
    },
    header: {
        color: "white"
    },
    span: {
        padding: "1rem"
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
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
    const [userMintAmount, setUserMintAmount] = useState<number>(0)
    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    const { approveAndMint, mintState: approveAndMintState } = useMint()

    const handleMint = (event: React.ChangeEvent<{}>) => {
        console.log(userMintAmount)
        return approveAndMint(userMintAmount)
    }

    const isMining = approveAndMintState.status === "Mining"

    const maxPublicMint = useMaxPublicMint()
    const classes = useStyles()
    const increase = (event: React.ChangeEvent<{}>) => {
        if (userMintAmount < maxPublicMint) setUserMintAmount(userMintAmount + 1)
    }

    const decrease = (event: React.ChangeEvent<{}>) => {
        if (userMintAmount > 0) setUserMintAmount(userMintAmount - 1)
    }

    return (
        <Box>
            <h1 className={classes.header}>Mint is live!</h1>
            <Box className={classes.box}>
                <TabContext value={selectedTokenIndex.toString()}>

                    <p className={classes.tabContent}>{useTotalSupply()} / {useMaxSupply()} minted</p>
                    <Box className={classes.mintBox}>
                        <Button variant="contained" onClick={increase}><AddIcon /></Button>
                        <p className={classes.span}>{userMintAmount}</p>
                        <Button variant="contained" onClick={decrease}><RemoveIcon /></Button>
                    </Box>
                    <Box className={classes.mintBox}>
                        <Button variant="contained" onClick={handleMint}>
                            {isMining ? <CircularProgress size={26} /> : "Mint"}
                        </Button>
                    </Box>



                    {/* <TabList onChange={handleChange} aria-label="stake form tabs">
                        {supportedTokens.map((token, index) => {
                            return (
                                <Tab label={token.name}
                                    value={index.toString()}
                                    key={index} />
                            )
                        })}
                    </TabList>
                    {supportedTokens.map((token, index) => {
                        return (
                            <TabPanel value={index.toString()} key={index}>
                                <div className={classes.tabContent}>
                                    <WalletBalance token={supportedTokens[selectedTokenIndex]} />
                                    <StakeForm token={supportedTokens[selectedTokenIndex]} />
                                </div>
                            </TabPanel>
                        )
                    })} */}
                </TabContext>
            </Box>
        </Box>

    )

}