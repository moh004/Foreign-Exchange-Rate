import { Chart } from "chart.js/auto"
import { useRef,useEffect,useState } from "react"
import "../styles/History.scss"

function History({based,to}){
    const canvasRef = useRef(null);
    const [firstRate,setFirstRate] = useState(0)
    const [lastRate,setLastRate] = useState(0)
    const [numberDays,setNumberDays] = useState(30)
    

    function bgColorGradient(ctx, chartArea){
            if (!chartArea) return null;

            const gradient = ctx.createLinearGradient(
                0,
                chartArea.top,
                0,
                chartArea.bottom
            );

            gradient.addColorStop(0, "#CEF739");
            gradient.addColorStop(0.5, "#cef73954");
            gradient.addColorStop(0.7, "#cef73918");
            gradient.addColorStop(1, "#cef73900");

            return gradient;
    }
    function convertDays(days) {
        const today = new Date();
        const newDate = new Date(today);

        newDate.setDate(today.getDate() - days);

        return newDate.toISOString().split("T")[0];
    }

    function reduceData(data, maxPoints = 500) {
        if (data.length <= maxPoints) return data;

        const step = Math.ceil(data.length / maxPoints);

        return data.filter((_, index) => index % step === 0);
    }

    useEffect( () => {
        const canvas = canvasRef.current
        if(!canvas) return

        let chart
        let cancelled = false

        async function fetchData(){
            const url = `https://api.frankfurter.dev/v2/rates?from=${convertDays(numberDays)}&base=${based}&quotes=${to}`
            console.log(url)
            const res = await fetch(url)
            const data = await res.json()
            
             if (cancelled || !data.length) return   // effect was cleaned up, or no data

            const dataChart = reduceData(data) 
            const labels = dataChart.map((d) => d.date)
            const rates = dataChart.map((d) => d.rate)
            setFirstRate(rates[0])
            setLastRate(rates[rates.length - 1])


            chart = new Chart(canvas, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [{
                        data: rates,
                        fill: true,
                        pointRadius: 0.5,
                        borderColor: '#CEF739',
                        borderWidth: 2,
                        backgroundColor: (context) => {
                            const {ctx, chartArea} = context.chart

                            return bgColorGradient(ctx, chartArea)
                        }
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true
                }
            })
        }

        fetchData().catch(console.error)

        // CleanUp
        return () => {
            cancelled = true
            chart?.destroy()
        }
    }, [based,to,numberDays])

    return(
        <>
          <div className="info-time">  
            <Info fr={firstRate} lr={lastRate} /> 
            <TimeLineSelection setNumberDays={setNumberDays}/>
          </div>
          <canvas className="canvas-chart" ref={canvasRef} /> 
        </>
    )
}

function Info({fr,lr}){

    return(
        <div className="state-con">
                <div className="open info-div">
                    <p>OPEN</p>
                    <p className="open-num text-20-r">{fr.toFixed(4)}</p>
                </div>

                <div className="Last info-div">
                    <p>LAST</p>
                    <p className="last-num text-20-r">{lr.toFixed(4)}</p>
                </div>

                <div className="change info-div">
                    <p>CHANGE</p>
                    <p className={`change-num text-20-r ${(lr - fr) < 0 ? "red" : "green"}`}>{(lr - fr) < 0.0001 && (lr - fr) > -0.0001? 0 : (lr - fr).toFixed(4)}</p>
                </div>

                <div className="change-per info-div">
                    <p>% CHANGE</p>
                    <p className="change-num-per text-20-r"></p>
                </div>
            </div>
    )
}

function TimeLineSelection({setNumberDays}){
    const [activeBtn, setActiveBtn] = useState("1y")
    function handleTheDays(days,strDays){
        setNumberDays(days)
        setActiveBtn(strDays)
    }
    return(
        <>
           <div className="btn-time-container">
                <button className={`btn-time ${activeBtn === "1w" ? "btn-time-active" : ""}`} onClick={() => handleTheDays(7,"1w")}>1W</button>
                <button className={`btn-time ${activeBtn === "1m" ? "btn-time-active" : ""}`} onClick={() => handleTheDays(30,"1m")}>1M</button>
                <button className={`btn-time ${activeBtn === "3m" ? "btn-time-active" : ""}`} onClick={() => handleTheDays(90,"3m")}>3M</button>
                <button className={`btn-time ${activeBtn === "1y" ? "btn-time-active" : ""}`} onClick={() => handleTheDays(365,"1y")}>1Y</button>
                <button className={`btn-time ${activeBtn === "5y" ? "btn-time-active" : ""}`} onClick={() => handleTheDays(1780,"5y")}>5Y</button>
                <button className={`btn-time ${activeBtn === "10y" ? "btn-time-active" : ""}`} onClick={() => handleTheDays(3650,"10y")}>10Y</button>
           </div> 
        </>
    )
}

export default History