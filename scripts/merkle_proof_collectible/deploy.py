from scripts.helpful_scripts import get_account
from web3 import Web3

from brownie import MerkleProofCollectible, network, config


def deploy():
    account = get_account()
    contract = MerkleProofCollectible.deploy({"from": account})


def main():
    deploy()
