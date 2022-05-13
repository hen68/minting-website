from scripts.helpful_scripts import get_account
from web3 import Web3

from brownie import MerkleProofCollectible, network, config


def withdraw():
    account = get_account()
    contract = MerkleProofCollectible[-1]
    tx = contract.withdraw(
        {"from": account},
    )
    tx.wait(1)
    print("Withdrawal successful!")
    return


def main():
    withdraw()
