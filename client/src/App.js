import React, { useState } from 'react';

// eslint-disable-next-line no-unused-vars
import { useWeb3Network, useEphemeralKey, useWeb3Injected } from '@openzeppelin/network/react';
import { Flex, Box, Button, Input, Field } from 'rimble-ui';

import Web3Info from './components/Web3Info/index.js';
//import Counter from './components/Counter/index.js';
import CounterSimplified from './components/CounterSimplified';

import styles from './App.module.scss';

// eslint-disable-next-line no-unused-vars
const infuraToken = process.env.REACT_APP_INFURA_TOKEN || '95202223388e49f48b423ea50a70e336';

function App() {
  // get ephemeralKey
  // eslint-disable-next-line no-unused-vars
  const signKey = useEphemeralKey();

  // get GSN web3
  // const context = useWeb3Network(`wss://rinkeby.infura.io/ws/v3/${infuraToken}`, {
  //   pollInterval: 15 * 1000,
  //   gsn: {
  //     signKey,
  //   },
  // });

  const context = useWeb3Network('http://127.0.0.1:8545', {
    gsn: {
      dev: true,
      signKey,
    },
  });

  // load Counter json artifact
  let counterJSON = undefined;
  try {
    // see https://github.com/OpenZeppelin/solidity-loader
    counterJSON = require('../../contracts/Counter.sol');
  } catch (e) {
    console.log(e);
  }

  // load Counter instance
  const [counterInstance, setCounterInstance] = useState(undefined);
  let deployedNetwork = undefined;
  if (!counterInstance && context && counterJSON && counterJSON.networks && context.networkId) {
    deployedNetwork = counterJSON.networks[context.networkId.toString()];
    if (deployedNetwork) {
      setCounterInstance(new context.lib.eth.Contract(counterJSON.abi, deployedNetwork.address));
    }
  }

  function renderNoWeb3() {
    return (
      <div className={styles.loader}>
        <h3>Web3 Provider Not Found</h3>
        <p>Please, install and run Ganache.</p>
      </div>
    );
  }

  const [fiatBalance] = useState(160297.61);
  const [cryptoBalance] = useState(7.34);
  const [demand] = useState([
    {
      quantity: 3.51,
      price: 2108,
      address: '0x6460f9F0C0b34f1FB75b636d70440141c63A5DfB',
    },
    {
      quantity: 0.91,
      price: 2107,
      address: '0x173d92bF5C4B137033428B9896113B2940938B18',
    },
    {
      quantity: 9.98,
      price: 2100,
      address: '0x418080b8F7435064B87157A5188c77b583b1C080',
    },
    {
      quantity: 1.54,
      price: 2064,
      address: '0x5259f281982e220f729257BC6ab0702Fe0855315',
    },
  ]);
  const [demandQuantity] = useState(0);
  const [demandQuantityField] = useState(0);
  const [demandPrice] = useState(2109);
  const [demandPriceField] = useState(2109);
  const [demandButton] = useState(false);
  const [supply] = useState([
    {
      quantity: 5.52,
      price: 2109,
      address: '0x04778c61DA004Fd166d8c289948D30679AA83630',
    },
    {
      quantity: 1.99,
      price: 2112,
      address: '0xDc06E1dF71B46facF558b529D73323e8b6a13C14',
    },
    {
      quantity: 0.58,
      price: 2120,
      address: '0x110DdCc9A0C379BBa6Fa29A9411E83d3fF56E392',
    },
    {
      quantity: 7.66,
      price: 2184,
      address: '0xB1F4800e8ae4dB4B217Fd59388922f1319f278fE',
    },
  ]);
  const [supplyQuantity] = useState(0);
  const [supplyQuantityField] = useState(0);
  const [supplyPrice] = useState(2018);
  const [supplyPriceField] = useState(2108);
  const [supplyButton] = useState(false);
  const [userAddress] = useState('0x74dbe487683c2e0Bc03cfECA02EBfc0A8ED8C5c7');

  const handleDemandQuantityChange = event => {
    const balance = fiatBalance;
    const price = demandPrice;
    let disableButton = false;
    if (
      isNaN(parseFloat(event.target.value)) ||
      parseFloat(event.target.value) * price > balance ||
      parseFloat(event.target.value) <= 0
    ) {
      disableButton = true;
      this.setState({
        demandButton: disableButton,
        demandQuantityField: event.target.value,
      });
    } else {
      this.setState({
        demandQuantity: parseFloat(event.target.value),
        demandQuantityField: event.target.value,
        demandButton: disableButton,
      });
    }
  };
  const handleDemandPriceChange = event => {
    const balance = this.state.fiatBalance;
    const quantity = this.state.demandQuantity;
    let disableButton = false;
    if (
      isNaN(parseFloat(event.target.value)) ||
      parseFloat(event.target.value) * quantity > balance ||
      parseFloat(event.target.value) <= 0
    ) {
      disableButton = true;
      this.setState({
        demandButton: disableButton,
        demandPriceField: event.target.value,
      });
    } else {
      this.setState({
        demandPriceField: event.target.value,
        demandPrice: parseFloat(event.target.value),
        demandButton: disableButton,
      });
    }
  };
  const handleDemandSubmit = () => {
    const { demand, demandQuantity, demandPrice, supply, userAddress } = this.state;
    demand.push({
      quantity: demandQuantity,
      price: demandPrice,
      address: userAddress,
    });

    demand.sort(function(obj1, obj2) {
      return obj2.price - obj1.price;
    });

    matchDemandToSupply(demand, demandQuantity, demandPrice, supply);

    this.setState({
      demandQuantity: 0,
      demandPrice: 0,
    });
  };

  const handleSupplyQuantityChange = event => {
    const balance = this.state.cryptoBalance;
    let disableButton = false;
    if (
      isNaN(parseFloat(event.target.value)) ||
      parseFloat(event.target.value) > balance ||
      parseFloat(event.target.value) <= 0
    ) {
      disableButton = true;
      this.setState({
        supplyButton: disableButton,
        supplyQuantityField: event.target.value,
      });
    } else {
      this.setState({
        supplyQuantity: parseFloat(event.target.value),
        supplyQuantityField: event.target.value,
        supplyButton: disableButton,
      });
    }
  };
  const handleSupplyPriceChange = event => {
    let disableButton = false;
    if (isNaN(parseFloat(event.target.value)) || parseFloat(event.target.value) <= 0) {
      disableButton = true;
      this.setState({
        supplyButton: disableButton,
        supplyPriceField: event.target.value,
      });
    } else {
      this.setState({
        supplyPriceField: event.target.value,
        supplyPrice: parseFloat(event.target.value),
        supplyButton: disableButton,
      });
    }
  };
  const handleSupplySubmit = () => {
    const { supply, supplyQuantity, supplyPrice, demand, userAddress } = this.state;
    supply.push({
      quantity: this.state.supplyQuantity,
      price: this.state.supplyPrice,
      address: userAddress,
    });

    supply.sort(function(obj1, obj2) {
      return obj1.price - obj2.price;
    });

    matchSupplyToDemand(supply, supplyQuantity, supplyPrice, demand);

    this.setState({
      supplyQuantity: 0,
      supplyPrice: 0,
    });
  };

  const matchDemandToSupply = (demand, quantity, price, supply) => {
    let { cryptoBalance, fiatBalance } = this.state;
    let supplyIndex = 0;
    let demandRemaining = true;

    let supplyCheck1 = supplyCheck(
      demand,
      supply,
      quantity,
      price,
      supplyIndex,
      demandRemaining,
      cryptoBalance,
      fiatBalance,
    );
    demandRemaining = supplyCheck1[0];
    supplyIndex = supplyCheck1[1];
    quantity = supplyCheck1[2];
    cryptoBalance = supplyCheck1[3];
    fiatBalance = supplyCheck1[4];

    while (demandRemaining) {
      supplyCheck1 = supplyCheck(
        demand,
        supply,
        quantity,
        price,
        supplyIndex,
        demandRemaining,
        cryptoBalance,
        fiatBalance,
      );
      demandRemaining = supplyCheck1[0];
      supplyIndex = supplyCheck1[1];
      quantity = supplyCheck1[2];
      cryptoBalance = supplyCheck1[3];
      fiatBalance = supplyCheck1[4];
    }
    console.log('Fiat balance: ' + fiatBalance + ', Crypto balance: ' + cryptoBalance);
    this.setState({
      cryptoBalance,
      fiatBalance,
    });
  };
  const supplyCheck = (demand, supply, quantity, price, index, demandRemaining, cryptoBalance, fiatBalance) => {
    if (supply.length !== 0) {
      console.log(price, supply[0].price);
      const lowestPricedSupply = supply[0];
      if (price >= lowestPricedSupply.price) {
        console.log('Match found');
        if (quantity === lowestPricedSupply.quantity) {
          console.log('Direct match');
          quantity -= lowestPricedSupply.quantity;
          demandRemaining = false;

          cryptoBalance += lowestPricedSupply.quantity;
          fiatBalance -= price * lowestPricedSupply.quantity;
        } else if (quantity > lowestPricedSupply.quantity) {
          console.log(quantity, lowestPricedSupply.quantity);
          console.log('More demand than supply ' + index);
          const remainingDemand = parseFloat((quantity - lowestPricedSupply.quantity).toFixed(2));

          let newSupply = supply;
          let newDemand = demand;

          console.log(
            'Matched demand of ' + quantity + 'ETH with supply of ' + lowestPricedSupply.quantity + 'ETH at $' + price,
          );
          console.log('Remaining demand = ' + remainingDemand);

          cryptoBalance = parseFloat((cryptoBalance + lowestPricedSupply.quantity).toFixed(2));
          fiatBalance -= parseFloat((price * lowestPricedSupply.quantity).toFixed(2));

          newDemand[0].quantity = remainingDemand;
          newSupply.splice(0, 1);

          quantity = remainingDemand;
          index += 1;
        } else if (quantity < lowestPricedSupply.quantity) {
          console.log('More of supply ' + index + ' than demand');
          const remainingSupply = (lowestPricedSupply.quantity - quantity).toFixed(2);

          let newSupply = supply;
          let newDemand = demand;

          console.log(
            'Matched demand of ' + quantity + 'ETH with supply of ' + lowestPricedSupply.quantity + 'ETH at $' + price,
          );
          console.log('Remaining supply = ' + remainingSupply);
          newSupply[0].quantity = remainingSupply;
          newDemand.splice(0, 1);

          this.setState({
            supply: newSupply,
            demand: newDemand,
          });

          cryptoBalance += quantity;
          fiatBalance -= price * quantity;

          quantity = 0;
          demandRemaining = false;
        } else {
          demandRemaining = false;
        }
      } else {
        console.log('Bought all available supply below given price');
        demandRemaining = false;
      }
    } else {
      console.log('Bought all available supply');
      demandRemaining = false;
    }
    return [demandRemaining, index, quantity, cryptoBalance, fiatBalance];
  };

  const matchSupplyToDemand = (supply, quantity, price, demand) => {
    let { cryptoBalance, fiatBalance } = this.state;
    let demandIndex = 0;
    let supplyRemaining = true;

    let demandCheck1 = demandCheck(
      demand,
      supply,
      quantity,
      price,
      demandIndex,
      supplyRemaining,
      cryptoBalance,
      fiatBalance,
    );
    supplyRemaining = demandCheck1[0];
    demandIndex = demandCheck1[1];
    quantity = demandCheck1[2];
    cryptoBalance = demandCheck1[3];
    fiatBalance = demandCheck1[4];

    while (supplyRemaining) {
      demandCheck1 = demandCheck(
        demand,
        supply,
        quantity,
        price,
        demandIndex,
        supplyRemaining,
        cryptoBalance,
        fiatBalance,
      );
      supplyRemaining = demandCheck1[0];
      demandIndex = demandCheck1[1];
      quantity = demandCheck1[2];
      cryptoBalance = demandCheck1[3];
      fiatBalance = demandCheck1[4];
    }

    console.log('Fiat balance: ' + fiatBalance + ', Crypto balance: ' + cryptoBalance);
    this.setState({
      cryptoBalance,
      fiatBalance,
    });
  };
  const demandCheck = (demand, supply, quantity, price, index, supplyRemaining, cryptoBalance, fiatBalance) => {
    if (demand.length !== 0) {
      const highestPricedDemand = demand[0];
      if (price <= highestPricedDemand.price) {
        console.log('Match found');
        if (quantity === highestPricedDemand.quantity) {
          console.log('Direct match');
          quantity -= highestPricedDemand.quantity;
          supplyRemaining = false;

          cryptoBalance -= highestPricedDemand.quantity;
          fiatBalance += price * highestPricedDemand.quantity;
        } else if (quantity > highestPricedDemand.quantity) {
          console.log(quantity, highestPricedDemand.quantity);
          console.log('More supply than demand ' + index);
          const remainingSupply = parseFloat((quantity - highestPricedDemand.quantity).toFixed(2));

          let newSupply = supply;
          let newDemand = demand;

          console.log(
            'Matched supply of ' + quantity + 'ETH with demand of ' + highestPricedDemand.quantity + 'ETH at $' + price,
          );
          console.log('Remaining supply = ' + remainingSupply);

          console.log(cryptoBalance, parseFloat(highestPricedDemand.quantity.toFixed(2)));

          cryptoBalance = parseFloat((cryptoBalance - highestPricedDemand.quantity).toFixed(2));
          fiatBalance += parseFloat((price * highestPricedDemand.quantity).toFixed(2));

          newSupply[0].quantity = remainingSupply;
          newDemand.splice(0, 1);

          quantity = remainingSupply;
          index += 1;
        } else if (quantity < highestPricedDemand.quantity) {
          console.log('More of demand ' + index + ' than supply');
          const remainingDemand = (highestPricedDemand.quantity - quantity).toFixed(2);

          let newSupply = supply;
          let newDemand = demand;

          console.log(
            'Matched supply of ' + quantity + 'ETH with demand of ' + highestPricedDemand.quantity + 'ETH at $' + price,
          );
          console.log('Remaining demand = ' + remainingDemand);
          newDemand[0].quantity = remainingDemand;
          newSupply.splice(0, 1);

          this.setState({
            supply: newSupply,
            demand: newDemand,
          });

          cryptoBalance -= quantity;
          fiatBalance += price * quantity;

          quantity = 0;
          supplyRemaining = false;
        } else {
          supplyRemaining = false;
        }
      } else {
        console.log('Sold to all available demand below given price');
        supplyRemaining = false;
      }
    } else {
      console.log('Sold to all available demand');
      supplyRemaining = false;
    }
    return [supplyRemaining, index, quantity, cryptoBalance, fiatBalance];
  };

  return (
    <div className={styles.App}>
      <div className={styles.wrapper}>
        {!context.lib && renderNoWeb3()}
        <div className="App">
          <Flex>
            <Box p={3} width={1} color="salmon" bg="black">
              <h1> Crypto-less Blockchain Interaction </h1>
              <h3>Your Address: {userAddress}</h3>
            </Box>
          </Flex>
          <Flex>
            <Box p={3} width={1 / 2} color="salmon" bg="black">
              <h3> DEMAND </h3>
              <h4 style={{ marginBottom: 0 }}> BALANCE </h4>
              <h1 style={{ marginTop: 0 }}> ${fiatBalance.toFixed(2)} </h1>
              <h4 style={{ marginBottom: 0 }}> EXAMPLE INTERACTION </h4>
              <Button.Outline mainColor="salmon" borderColor="salmon">
                Press Button
              </Button.Outline>
              <CounterSimplified {...context} JSON={counterJSON} instance={counterInstance} deployedNetwork={deployedNetwork} />
              <h3> OR </h3>
              <h4 style={{ marginBottom: 0 }}> ADD DEMAND </h4>
              <Flex>
                <Box width={1 / 6} color="salmon" bg="black" />
                <Box width={1 / 3} color="salmon" bg="black">
                  <Field label="Quantity">
                    <Input
                      required
                      type="number"
                      onChange={handleDemandQuantityChange}
                      value={demandQuantityField}
                      color="salmon"
                      bg="black"
                    />
                  </Field>
                </Box>
                <Box width={1 / 3} color="salmon" bg="black">
                  <Field label="Price">
                    <Input
                      required
                      label="Price"
                      type="number"
                      placeholder="Price"
                      onChange={handleDemandPriceChange}
                      value={demandPriceField}
                      color="salmon"
                      bg="black"
                    />
                  </Field>
                </Box>
                <Box width={1 / 6} color="salmon" bg="black" />
              </Flex>
              <h5 style={{ marginTop: 0 }}> You can afford {(fiatBalance * (1 / demandPrice)).toFixed(6)} ETH</h5>
              <Button.Outline
                mainColor="salmon"
                borderColor="salmon"
                disabled={demandButton}
                onClick={handleDemandSubmit}
                p={3}
              >
                {' '}
                Submit{' '}
              </Button.Outline>
              <h4 style={{ marginBottom: 0 }}> CURRENT DEMAND </h4>
              <Flex>
                <Box width={2 / 7} color="salmon" bg="black" />
                <Box width={1 / 7} color="salmon" bg="black">
                  <h4> Address </h4>
                </Box>
                <Box width={1 / 7} color="salmon" bg="black">
                  <h4> Quantity </h4>
                </Box>
                <Box width={1 / 7} color="salmon" bg="black">
                  <h4> Price </h4>
                </Box>
                <Box width={2 / 7} color="salmon" bg="black" />
              </Flex>
              {demand.map((data, key) => {
                return (
                  <div key={key}>
                    <Flex>
                      <Box width={2 / 7} color="salmon" bg="black" />
                      <Box width={1 / 7} color="salmon" bg="black">
                        <h5 style={{ margin: 0 }}>{data.address.slice(0, 8)}...</h5>
                      </Box>
                      <Box width={1 / 7} color="salmon" bg="black">
                        <h5 style={{ margin: 0 }}>{data.quantity} ETH</h5>
                      </Box>
                      <Box width={1 / 7} color="salmon" bg="black">
                        <h5 style={{ margin: 0 }}>${data.price}</h5>
                      </Box>
                      <Box width={2 / 7} color="salmon" bg="black" />
                    </Flex>
                  </div>
                );
              })}
            </Box>
            <Box p={3} width={1 / 2} color="white" bg="salmon">
              <h3> SUPPLY </h3>
              <h4 style={{ marginBottom: 0 }}> BALANCE </h4>
              <h1 style={{ marginTop: 0 }}> {cryptoBalance} ETH </h1>
              <h4> ADD SUPPLY </h4>
              <Flex>
                <Box width={1 / 6} color="white" bg="salmon" />
                <Box width={1 / 3} color="white" bg="salmon">
                  <Field label="Quantity">
                    <Input
                      required
                      label="Quantity"
                      type="number"
                      onChange={handleSupplyQuantityChange}
                      value={supplyQuantityField}
                      color="white"
                      bg="salmon"
                    />
                  </Field>
                </Box>
                <Box width={1 / 3} color="white" bg="salmon">
                  <Field label="Price">
                    <Input
                      required
                      label="Price"
                      type="number"
                      placeholder="Price"
                      onChange={handleSupplyPriceChange}
                      value={supplyPriceField}
                      color="white"
                      bg="salmon"
                    />
                  </Field>
                </Box>
                <Box width={1 / 6} color="white" bg="salmon" />
              </Flex>
              <Button.Outline mainColor="white" borderColor="white" disabled={supplyButton} onClick={handleSupplySubmit}>
                {' '}
                Submit{' '}
              </Button.Outline>
              <Flex>
                <Box width={2 / 7} color="white" bg="salmon" />
                <Box width={1 / 7} color="white" bg="salmon">
                  <h4> Address </h4>
                </Box>
                <Box width={1 / 7} color="white" bg="salmon">
                  <h4> Quantity </h4>
                </Box>
                <Box width={1 / 7} color="white" bg="salmon">
                  <h4> Price </h4>
                </Box>
                <Box width={2 / 7} color="white" bg="salmon" />
              </Flex>
              {supply.map((data, key) => {
                return (
                  <div key={key}>
                    <Flex>
                      <Box width={2 / 7} color="white" bg="salmon" />
                      <Box width={1 / 7} color="white" bg="salmon">
                        <h5 style={{ margin: 0 }}>{data.address.slice(0, 8)}...</h5>
                      </Box>
                      <Box width={1 / 7} color="white" bg="salmon">
                        <h5 style={{ margin: 0 }}>{data.quantity} ETH</h5>
                      </Box>
                      <Box width={1 / 7} color="white" bg="salmon">
                        <h5 style={{ margin: 0 }}>${data.price}</h5>
                      </Box>
                      <Box width={2 / 7} color="white" bg="salmon" />
                    </Flex>
                  </div>
                );
              })}
            </Box>
          </Flex>
        </div>
      </div>
    </div>
  );
}

export default App;
