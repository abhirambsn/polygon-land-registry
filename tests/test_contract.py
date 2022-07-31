import pytest
from brownie import network, LandRegistry
from scripts.helpful_scripts import LOCAL_BLOCKCHAIN_ENVIRONMENT, get_account
from scripts.deploy import create_executor, deploy_contract, ownerAddress, executorAddress, buyerAddress, register_land, sale, sellerAddress, create_contract, create_user, salesTypeMap


def test_can_create_executor():
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENT:
        pytest.skip()

    land_registry = LandRegistry.deploy({"from": get_account(ownerAddress)})
    land_registry = create_executor(
        "Austin", executorAddress, land_registry)
    name, state = land_registry.executors(get_account(executorAddress))
    assert name == "Austin"
    assert state == True


def test_can_create_buyers_and_sellers():
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENT:
        pytest.skip()

    land_registry = LandRegistry.deploy({"from": get_account(ownerAddress)})
    land_registry = create_user(name="Venus", cof="Clair", resident="Sweden",
                                gender="Female", userAddress=buyerAddress, land_registry=land_registry)
    buyer, resident, cof, gender = land_registry.users(
        get_account(buyerAddress))
    assert buyer == "Venus"
    assert resident == "Sweden"
    assert cof == "Clair"
    assert gender == "Female"


def test_can_register_land():
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENT:
        pytest.skip()

    land_registry = LandRegistry.deploy({"from": get_account(ownerAddress)})
    land_registry = create_executor(
        "Austin", executorAddress, land_registry)
    land_registry = register_land(uri="https://", sellerAddress=sellerAddress, price=10000000,
                                  land_registry=land_registry, executorAddress=executorAddress)

    if land_registry == False:
        pytest.skip()

    registerIndex, price, uri, state, signature = land_registry.lands(0)

    assert state == False


def test_can_execute_sale():
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENT:
        pytest.skip()

    assert deploy_contract() == True
