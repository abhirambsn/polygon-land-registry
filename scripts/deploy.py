from brownie import LandRegistry, accounts, config, network
from scripts.helpful_scripts import get_account
from web3 import Web3

ownerAddress = config["wallets"]["owner_addr"]
executorAddress = config["wallets"]["executor_addr"]
sellerAddress = config["wallets"]["seller_addr"]
buyerAddress = config["wallets"]["buyer_addr"]


salesTypeMap = {
    "NEW": 0,
    "RESALE": 1,
    "INHERITANCE": 2,
    "GIFT": 3
}


def main():
    # LandRegistry.deploy(
    #     {"from": get_account(ownerAddress)})
    # land_registry = create_contract()
    print(deploy_contract())


def create_contract():
    if LandRegistry == []:
        land_registry = LandRegistry.deploy(
            {"from": get_account(ownerAddress)})
    else:
        land_registry = LandRegistry[-1]

    return land_registry


def create_executor(name=None, executorAddress=None, land_registry=None):
    if not name or not executorAddress or not land_registry:
        return False

    tx = land_registry.addExecutor(name, get_account(executorAddress), {
                                   "from": get_account(ownerAddress)})
    tx.wait(1)

    return land_registry


def create_user(name: str = None, cof: str = None, resident: str = None, gender: str = None, userAddress=None, land_registry=None):
    if not name or not cof or not resident or not gender or not userAddress or not land_registry:
        return False

    tx = land_registry.registerUserInRegistry(name, cof, resident, gender, {
                                              "from": get_account(userAddress)})
    tx.wait(1)

    return land_registry


def register_land(uri=None, sellerAddress=None, price=None, executorAddress=None, land_registry=None):
    if not uri or not sellerAddress or not price or not land_registry or not executorAddress:
        return False

    tx = land_registry.registerLand(uri, get_account(sellerAddress), price, {
                                    "from": get_account(executorAddress)})
    tx.wait(1)

    return land_registry


def sale(seller=None, buyer=None, landToken=None, saleType=None, salePrice=None, executor=None, land_registry=None):

    print(seller, buyer, landToken, saleType,
          salePrice, executor, land_registry)

    if not seller or not buyer or landToken is None or not salePrice or not land_registry or not executor or saleType is None:
        return False

    tx = land_registry.executeSale(get_account(seller), get_account(
        buyer), landToken, saleType, salePrice, {"from": get_account(executor)})
    tx.wait(1)

    return land_registry


def deploy_contract():
    land_registry = LandRegistry.deploy({"from": get_account(ownerAddress)})
    if land_registry:
        land_registry = create_executor(
            "Austin", executorAddress, land_registry)
    if land_registry:
        land_registry = create_user(name="Buyer", cof="Father", resident="India",
                                    gender="Male", userAddress=buyerAddress, land_registry=land_registry)
        print("Success")
    if land_registry:
        land_registry = create_user(name="Seller", cof="Mother", resident="India",
                                    gender="Female", userAddress=sellerAddress, land_registry=land_registry)
        print("Success")
    if land_registry:
        land_registry = register_land(uri="https://", sellerAddress=sellerAddress,
                                      price=10, land_registry=land_registry, executorAddress=executorAddress)
        print(f"Success {land_registry}")
    if land_registry:
        land_registry = sale(seller=sellerAddress, buyer=buyerAddress, landToken=0,
                             saleType=salesTypeMap["NEW"], salePrice=11, executor=executorAddress, land_registry=land_registry)
        print("Success")

    return True
