from scripts.helpful_scripts import get_account
from web3 import Web3

from brownie import MerkleProofCollectible, network, config


def set_token_uri_and_merkle_root():
    account = get_account()
    contract = MerkleProofCollectible[-1]
    tx = contract.setTokenUri(
        "https://bounty.mypinata.cloud/ipfs/QmaSzyUt63JojuMBEkH8UrqYU3DaC25vsUf1CkDqrxpG2y/",
        {"from": account},
    )
    tx.wait(1)

    tx2 = contract.setPlaceHolderUri(
        "https://gateway.pinata.cloud/ipfs/QmYfwAsnkaYyWiag6YWvyVUFkjvxmNuNyWnjNmHrHtV3Bv",
        {"from": account},
    )
    tx2.wait(1)

    tx3 = contract.setMerkleRoot(
        "f276f4db00628545cc7cd1121a8a7d5e41aa2f43a16fae8064315914cb257439",
        {"from": account},
    )
    tx3.wait(1)
    return


def main():
    set_token_uri_and_merkle_root()
