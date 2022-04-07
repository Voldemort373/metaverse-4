
import { ethers } from "ethers";
import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, MapControls } from '@react-three/drei';
import { Physics } from '@react-three/cannon'; 

import { networks } from '../utils/networks';
import Navbar from './Navbar'
import Plane from './Plane'
import Plot from './Plot'
import Building from './Building'

import { BoxLoading } from 'react-loadingg';
// Import contract json
import MetaContract from '../build/contracts/Land.sol/Land.json';

// Import contract address
const jsonContractData = require('../build/contracts/contract-address.json');
let CONTRACT_ADDRESS = jsonContractData.ContractAddress

function App() {
  const [currentAccount, setCurrentAccount] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [network, setNetwork] = useState('')

  const [landContract, setLandContract] = useState('')
  const [cost, setCost] = useState(0)
  const [buildings, setBuildings] = useState(null)

  const [landId, setLandId] = useState(null)
  const [landName, setLandName] = useState(null)
  const [landOwner, setLandOwner] = useState(null)
  const [hasOwner, setHasOwner] = useState(false)

  useEffect(() =>{
    const { ethereum } = window
    checkIfWalletIsConnected()

    if(ethereum){
      ethereum.on('accountsChanged', async(accounts) =>{
        if(accounts[0] != null){
          setCurrentAccount(accounts[0])
        }else{
          setCurrentAccount('')
        }
      })
    }
    const setupEventListener = async() =>{
      try{
        const {ethereum} = window
        if (ethereum){
          const provider = new ethers.providers.Web3Provider(ethereum)
          const signer = provider.getSigner()
          const land = new ethers.Contract(CONTRACT_ADDRESS, MetaContract.abi, signer)

          // write contract events listener here
        }
      }catch(error){
        console.log(error)
      }
    }
    setupEventListener()

    // loadBlockchainData()
  }, [])

  useEffect(() =>{
    // if(network === "Rinkeby"){
    //   loadBlockchainData()
    // }
    loadBlockchainData()
  }, [currentAccount, network])


  const loadBlockchainData = async () =>{

    try{
      const { ethereum } = window

      if(!ethereum){
        console.log("MetaMask not available.")
        return;
      }
      const accounts = await ethereum.request({ method: 'eth_accounts'})
      if (accounts.length !== 0){
        const acc = accounts[0]
        setCurrentAccount(acc)
      }else{
        console.log("No authorised accounts found.")
      }

      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const land = new ethers.Contract(CONTRACT_ADDRESS, MetaContract.abi, signer)
      setLandContract(land)

      const cost = await land.cost()
      setCost(ethers.utils.formatEther(cost))

      const buildings = await land.getBuildings()
      setBuildings(buildings)
      console.log("Buildings: ", buildings)
    }catch(error){
      console.log(error)
    }
  }

  const checkIfWalletIsConnected = async()=>{
    setIsConnecting(true)
    const {ethereum} = window
    if(!ethereum){
      console.log("MetaMask not available.")
      return;
    }

    const accounts = await ethereum.request({ method: 'eth_accounts'})
    if (accounts.length !== 0){
      const account = accounts[0]
      console.log("Current Account: ", account)
      setCurrentAccount(account)
    }else{
      console.log("No authorised accounts found.")
    }

    const chainId = await ethereum.request({method: 'eth_chainId'})
    setNetwork(networks[chainId])

    ethereum.on('chainChanged', handleChainChanged);

    function handleChainChanged(_chainId){
      window.location.reload()
    }

    setIsConnecting(false)
  }

  const connectWallet = async() =>{
    try{
      setIsConnecting(true)

      const {ethereum} = window;
      if(!ethereum){
        window.alert("Betaverse requires MetaMask. -> https://metamask.io/")
        return;
      }

      const accounts = await ethereum.request({method: "eth_requestAccounts"});
      setCurrentAccount(accounts[0])
      setIsConnecting(false)
    }catch(error){
      setIsConnecting(false)
      console.log(error)
    }
  }

  const buyHandler = async(_id) =>{
    try{
      let tx = await landContract.mint(_id, {value: ethers.utils.parseEther('1')})
      await tx.wait()

      const buildings = await landContract.getBuildings()
      setBuildings(buildings)

      setLandName(buildings[_id - 1].name)
      setLandOwner(buildings[_id - 1].owner)
      setHasOwner(true)
    }catch(error){
      window.alert("Error occurred when buying")
    }
  }

  return (
    <div>
      <Navbar connectWallet={connectWallet} account={currentAccount} />
      <Canvas camera={{ position: [0,0,200], up: [0,0,1], far: 10000 }}>
        <Suspense fallback={<BoxLoading />}>
          <Sky distance={450000} sunPosition={[1, 10, 0]} inclination={0} azimuth={0.25} /> 
          <ambientLight intensity={0.5}/>

          <Physics>
            { buildings && buildings.map ((building, index) => {
              if (building.owner === '0x0000000000000000000000000000000000000000'){
                return (
                  <Plot
                    key = {index}
                    position={[building.posX, building.posY, 0.1]}
                    size={[building.sizeX, building.sizeY]}
                    landId={index + 1}
                    landInfo={building}
                    setLandName={setLandName}
                    setLandOwner={setLandOwner}
                    setHasOwner={setHasOwner}
                    setLandId={setLandId}
                  />
                )
              }else{
                return (
                  <Building
                    key = {index}
                    position={[building.posX, building.posY, 0.1]}
                    size={[building.sizeX, building.sizeY, building.sizeZ]}
                    landId={index + 1}
                    landInfo={building}
                    setLandName={setLandName}
                    setLandOwner={setLandOwner}
                    setHasOwner={setHasOwner}
                    setLandId={setLandId}
                  />
                )
              }
            })}
          </Physics>
          <Plane setLandName={setLandName} setLandId={setLandId}/>
        </Suspense>
        <MapControls />
      </Canvas>

      {landId && (
        <div className="info">
        
          <h1 className="flex">{landName}</h1>
          <div className="flex-left">
            <div className="info--id">
              <h2>ID</h2>
              <p>{landId}</p>
            </div>

            <div className="info--owner">
              <h2>Owner</h2>
              <p>{landOwner}</p>
            </div>
            {!hasOwner && (
              <div className='info--owner'>
                <h2>Cost</h2>
                <p>{`${cost} ETH`}</p>
              </div>
            )}
          </div>
          <div className="d-flex">
            {!hasOwner && (
              <button onClick={() => buyHandler(landId)} className='button info--buy'>Buy Property</button>
            )}
            <button className="button" onClick={() => setLandId(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
