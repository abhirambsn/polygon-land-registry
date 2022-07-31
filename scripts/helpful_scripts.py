from brownie import accounts, network, config

LOCAL_BLOCKCHAIN_ENVIRONMENT = ["development", "ganache-local"]


def get_account(privateKey):
    return accounts.add(privateKey)
