import { useState, useEffect } from "react"
import "../styles/Converter.scss"
import ddSvg from "../assets/svg/icon-chevron-down.svg"
import exchangeSvg from "../assets/svg/icon-exchange.svg"
import starSvg from "../assets/svg/icon-star.svg"
// import exchangeVerSvg from "../assets/svg/icon-exchange-vertical.svg"
import currencies from "../data/currencies.json";

import History from "./history"
import Compare from "./compare"
import Log from "./log"
import Favorites from "./fav"


function Converter(){
    const [sendCny, setSendCny] = useState("USD") // so i will send the "setSendCny & setRecCny" to the  
    const [recCny, setRecCny] = useState("EUR")   // drop down and when we select another currency change it
    const [amount, setAmount] = useState(10)
    const [resultAmount,setResultAmount] = useState(0)

    function swap (){
        setSendCny(recCny)
        setRecCny(sendCny)
    }
    
    useEffect(() => {
        async function fetchRate() {
            try{
                const res = await fetch(`https://api.frankfurter.dev/v2/rates?base=${sendCny}&quotes=${recCny}`);
                const data = await res.json()
                const rate = data[0].rate
                console.log(rate)
                setResultAmount(amount * rate)
            }
            catch(e){
                console.log(e)
            }
        }

        fetchRate()
    }, [sendCny,recCny,amount])

    return(
        <>
        <div className="converter-warp">
            <h1 className="text-20-r">CHECK THE RATE</h1>

            <div className="converter-container">

                <div className="top-conainer">
                    <div className="div-currency">
                        <h2 className="text-14-r h-sr text-14-r">SEND</h2>
                        <input className="input-amount" 
                               type="number" placeholder="1,000"
                               value={amount}
                               onChange={(e) => setAmount(e.target.value)}
                               />
                        
                        <DropDown  currency={sendCny} onSelect={setSendCny}/>
                    </div>

                    <button className="ex-btn" onClick={swap}><img src={exchangeSvg} /></button>

                    <div className="div-currency">
                        <h2 className="text-14-r h-sr text-14-r">RECEIVE</h2>
                        <p className="output-amount">{resultAmount.toFixed(2)}</p>
                        
                        <DropDown currency={recCny} onSelect={setRecCny}/>
                    </div>
                </div>

                <div className="bottom-conainer">
                    <div className="conver-rate">
                        <p className="text-12-r">
                            <span>1 USD</span> = <span>0.85 EUR</span>
                        </p>
                    </div>

                    <div className="btn-fav-log">
                        <button className="btn-fav">
                            <img className="svg-star" src={starSvg} />
                            <p className="fav-p">FAVORITED</p>
                        </button>

                        <button className="btn-log">
                            LOG CONVERSION
                        </button>
                    </div>
                </div>
            </div>

            <div className="detail-con">
                <Tabs sendCny={sendCny} recCny={recCny}/>
            </div>
        </div>
        </>
    )
}


function DropDown({currency, onSelect}){
    const [isOpen, setIsOpen] = useState(false)
    const theSelected = currencies.find(i => i.iso_3 === currency)

    // instead of onSelect we send handleSelect
    const handleSelect = (code) => {
        onSelect(code)
        setIsOpen(false)
    }

    return(
        <>
        <div className="drop-down-btn" onClick={() => setIsOpen(!isOpen)}>
            <img className="flag-svg" src={theSelected.flag}/>
            <p className="text-14-r">{currency}</p>
            <img className="dd-svg" src={ddSvg} />    
        </div>

        {isOpen && <CurrencyDropdown handleSelect={handleSelect}/>}

        </>
    )
}

function CurrencyDropdown({ handleSelect }) { 

    return(
        <>
            <ul className="drop-down-container">
                {currencies.map(c => (
                            <Option key={c.id} 
                                    name={c.name}
                                    currency={c.iso_3}
                                    fileSrc={c.flag}
                                    handleSelect={handleSelect} />
                    ))}    
            </ul>
        </>
    )
}

function Option({name,currency,fileSrc,handleSelect}){

    return(
        <>
            <li className="selection-div" onClick={() => handleSelect(currency)}>
                <img className="flag-svg" src={fileSrc}/>
                <p className="text-14-r white-txt">{currency}</p>
                <p className="text-12-r">{name}</p>
            </li>
        </>
    )
}

function Tabs({sendCny,recCny}){
    const [activeTab, setActiveTab] = useState("history");

    return (
        <>
            <div className="tabs">
                <button
                    className={`btn-his btn-tab ${activeTab === "history" ? "active" : ""}`}
                    onClick={() => setActiveTab("history")}>
                    HISTORY
                </button>

                <button
                    className={`btn-com btn-tab ${activeTab === "compare" ? "active" : ""}`}
                    onClick={() => setActiveTab("compare")}>
                    COMPARE
                </button>

                <button
                    className={`btn-fav-tab btn-tab ${activeTab === "favorites" ? "active" : ""}`}
                    onClick={() => setActiveTab("favorites")}>
                    FAVORITES
                </button>

                <button
                    className={`btn-log-tab btn-tab ${activeTab === "log" ? "active" : ""}`}
                    onClick={() => setActiveTab("log")}>
                    LOG
                </button>
            </div>
                {activeTab === "history" && <History based={sendCny} to={recCny} />}
                {activeTab === "compare" && <Compare />}
                {activeTab === "favorites" && <Favorites />}
                {activeTab === "log" && <Log />}
           
                
        </>
    )
}


export default Converter
