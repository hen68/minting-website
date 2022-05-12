import { Token } from "../Main"
import Box from '@mui/material/Box';
import React, { useState } from "react"
import { TabContext, TabList, TabPanel } from "@mui/lab"
import { Tab } from '@mui/material'
import { makeStyles } from "@material-ui/core"
import { StakingBalance } from "../tokenFarm/StakingBalance"
import { useTotalSupply } from "../../hooks/useTotalSupply"
import { UnstakeForm } from "../tokenFarm/UnstakeForm"



interface YourWalletProps {
    supportedTokens: Array<Token>
}

const useStyles = makeStyles((theme) => ({
    tabContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(4)
    },
    box: {
        backgroundColor: "white",
        borderRadius: "25px",
    },
    header: {
        color: "white"
    }
}))

export const YourStakingBalance = ({ supportedTokens }: YourWalletProps) => {
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }
    const classes = useStyles()
    console.log(useTotalSupply())
    return (
        <Box>
            <h1 className={classes.header}>Token Farm Contract</h1>
            <Box className={classes.box}>
                <TabContext value={selectedTokenIndex.toString()}>
                    <TabList onChange={handleChange} aria-label="stake form tabs">
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
                                    <StakingBalance token={supportedTokens[selectedTokenIndex]} />
                                    <UnstakeForm token={supportedTokens[selectedTokenIndex]} />
                                </div>
                            </TabPanel>
                        )
                    })}
                </TabContext>
            </Box>
        </Box>

    )

}