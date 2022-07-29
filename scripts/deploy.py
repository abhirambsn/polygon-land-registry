from brownie import LandRegistry, accounts, network
from scripts.helpful_scripts import get_account
from web3 import Web3


def main():
    if LandRegistry == []:
        land_registry = LandRegistry.deploy({"from": get_account()})
    else:
        land_registry = LandRegistry[-1]
    land_registry = registerUserInRegistry(land_registry)
    land_registry = registerLand(land_registry)


def registerUserInRegistry(land_registry):
    name = "BSN Abhiram"
    cof = "ABC"
    resAddress = "Noida"
    gender = "Male"
    tx = land_registry.registerUserInRegistry(
        name, cof, resAddress, gender, {"from": get_account()})
    tx.wait(1)
    return land_registry


def registerLand(land_registry):
    uri = "https://ipfs.io/ipfs/QmbWA5NaQ2NSUTdiUZF1cxxYm2bum14mrf7DQFbU4W6fAc?filename=0.json"
    price = 200000
    tx = land_registry.registerLand(uri, price, {"from": get_account()})
    tx.wait(1)
    return land_registry
# Set up brownie networks by command -
# brownie networks add polygon polygon-alchemy host=<Alchemy APP HTTP Address> chainid=80001
# then run the script using command -
# brownie run scripts/deploy.py --network polygon-alchemy
