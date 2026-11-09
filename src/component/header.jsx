import logo from "../assets/svg/logo.svg"
import "../styles/Header.scss"

function Header(){

    return(
        <>
           <div className="header">
                <img src={logo} alt="logo" />

                <div>
                    <p className="h-info">55 CURRENCIES · EOD · ECB DATA</p>
                </div>
            </div> 

            <div className="live-market-con">
                <div className="live-market" >
                    <p className="text-12-m txt-b">● LIVE MARKET</p>
                </div>

                <div className="market-res">
                    {/* TODO:  the currency update*/}
                </div>
            </div>
        </>
    )
}


export default Header


