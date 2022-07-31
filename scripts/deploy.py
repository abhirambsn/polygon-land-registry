from brownie import LandRegistry, accounts, config, network
from scripts.helpful_scripts import get_account
from web3 import Web3

ownerAddress = config["wallets"]["owner_addr"]
executorAddress = config["wallets"]["executor_addr"]
sellerAddress = config["wallets"]["seller_addr"]
buyerAddress = config["wallets"]["buyer_addr"]


def main():
    land_registry =  LandRegistry.deploy(
        {"from": get_account(ownerAddress)})
    # if LandRegistry == []:
    #     land_registry = LandRegistry.deploy(
    #         {"from": get_account(ownerAddress)})
    # else:
    #     land_registry = LandRegistry[-1]
    print(land_registry)
