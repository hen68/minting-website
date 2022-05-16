from scripts.helpful_scripts import get_account
from web3 import Web3

from brownie import MerkleProofCollectible, network, config


def toggle_mint():
    account = get_account()
    contract = MerkleProofCollectible[-1]
    # tx = contract.togglePublicSale({"from": account})
    # tx.wait(1)

    tx2 = contract.toggleWhiteListSale({"from": account})
    tx2.wait(1)

    # tx2 = contract.whitelistMint(
    #     [
    #         "0xf5052e7fc6ead0b836175774ae11c56eb02af9eb3524e5340000da3270c2215a",
    #         "0xe11d5dc3584142e96ce185e834f01f7e9e97b2436957ddf4229da42183d31df0",
    #         "0x0c0cfd54e7c680034e5bac5824d5762b20d950b9f2deea428bf60c71ee636c73",
    #     ],
    #     1,
    #     {"from": account, "amount": Web3.toWei("0.0799", "ether")},
    # )
    # tx2 = contract.withdraw({"from": account})
    # tx2.wait(1)


def main():
    toggle_mint()
