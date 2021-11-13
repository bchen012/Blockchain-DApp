import json

json_list = [
    'Backend/build/contracts/YM1.json',
    'Backend/build/contracts/YM2.json',
    'Backend/build/contracts/KleeMine.json',
    'Backend/build/contracts/KleeTokenV6.json',
    'Backend/build/contracts/KleeCoinV2.json',
    'Backend/build/contracts/KleeRewardV2.json'
]

address_config_names = [
    'YM1_CONTRACT_ADDRESS',
    'YM2_CONTRACT_ADDRESS',
    'K_MINE_CONTRACT_ADDRESS',
    'KV6_CONTRACT_ADDRESS',
    'KV2_CONTRACT_ADDRESS',
    'K_REWARD_CONTRACT_ADDRESS'
]

abi_config_names = [
    'YM1_ABI',
    'YM2_ABI',
    'K_MINE_ABI',
    'KV6_ABI',
    'KV2_ABI',
    'K_REWARD_ABI'
]

# Clear old content
open("Frontend/packages/app/src/config.js", "w").close()

config_f = open("Frontend/packages/app/src/config.js", "a")

index = 0
for json_file in json_list:
    json_f = open(json_file)
    data = json.load(json_f)
    address = data['networks']['5777']['address']
    abi = data['abi']

    config_f.write("export const " + address_config_names[index] + " = '" + address + "'\n")

    config_f.write("export const " + abi_config_names[index] + " = " + str(abi) + "\n")
    index += 1


config_f.close()