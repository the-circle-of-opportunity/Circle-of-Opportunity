cd ~/.ethereum/testnet
# read -rsp $'Press enter to continue...\n'

# start Geth on testnet blockchain with CORS to allow incoming connections from localhost:3000
geth --rpc --rpccorsdomain "http://localhost:3000" --rpcapi "db,eth,net,personal,web3" --testnet --fast console

# Server configuration
#geth --rpc --rpcaddr "146.169.45.137" --rpccorsdomain "http://146.169.45.137:3000" --rpcapi "db,eth,net,personal,web3" --testnet --fast
