from brownie import LandRegistry, accounts, config, network
from scripts.helpful_scripts import get_account
from web3 import Web3

executorAddressPKey = config["wallets"]["executor_addr"]
executorAddress = config["wallets"]["executor_addr_pub_key"]
sellerAddress = config["wallets"]["seller_addr"]
buyerAddress = config["wallets"]["buyer_addr"]

def main():
    # if LandRegistry == []:
    #     land_registry = LandRegistry.deploy({"from": get_account()})
    # else:
    #     land_registry = LandRegistry[-1]
    land_registry = LandRegistry.deploy({"from": get_account()})
    print(land_registry)


# Set up brownie networks by command -
# brownie networks add polygon polygon-alchemy host=<Alchemy APP HTTP Address> chainid=80001
# then run the script using command -
# brownie run scripts/deploy.py --network polygon-alchemy
