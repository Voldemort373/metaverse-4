import metaLogo from '../assets/meta-logo.png';
import Identicon from 'identicon.js';

const Navbar = ({ connectWallet, account }) =>{
	const identiconStyle = {
		width: 30,
		height: 30,
		borderRadius: 30 / 2,
		overflow: "hidden",
		borderWidth: 2,
		borderColor: "grey"
	}
	return(
		<nav className="navbar navbar-dark fixed-top bg-dark flex-nowrap p-0 shadow">
        
        <a
          className="navbar-brand col-sm-3 col-md-2 mt-1"
          style = {{marginLeft: '10px'}}
          href="."
          rel="noopener noreferrer"
        >
          <div className= "nav-link-hover">
            <img src={metaLogo} height="30" className="mb-1 mr-2" style = {{color: 'white', marginRight: '10px', marginBottom: '10px'}}alt="" />
            Betaverse
          </div>
        </a>
       
        <div className = "nav-link-hover">

          <ul className="navbar-nav px-2">
              <li className="navbar-item text-nowrap d-sm-block ">
                  {account !== ''
                      ? <><img
                    width='30'
                    height='30'
                    style = {identiconStyle}
                    onClick= {() => window.open(`https://etherscan.io/address/${account}`, "_blank")}
                    rel="noopener noreferrer"
                    src={`data:image/png;base64,${new Identicon(account, 30).toString()}`}
                    alt="" /><span className="textshadow" style = {{color: 'white', marginRight: '5px'}}>&nbsp;|</span></>
                      :<span><button 
                                className="button"
                                onClick={connectWallet}
                                >
                                  Connect Wallet
                              </button>
                      </span>
                  }
     
           
        				<small className="text-secondary">
        					<small 
        					  id="account" 
        					  style={{color: 'white'}}
        					  >{account? <span>{account.slice(0,7) + '...' + account.slice(35, 42)}</span>: ""}
        					</small>
        				</small>
                      

              </li>
          </ul>

        </div>
      </nav>
	)
}

export default Navbar