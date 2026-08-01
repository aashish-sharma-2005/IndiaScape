import { useEffect, useState } from "react"
import { Home } from "../../component/Home"
import { useNavigate } from "react-router-dom"


export function HomePage() {
    const navigate = useNavigate()
    // const [sliderData,setSliderData] = useState([])
    // const [someCardsData,setSomeCardsData] = useState([])
    // useEffect(()=>{
    //     const getData = async ()=>{
    //         try {
    //             const response = await fetch('http://localhost:3000/dashboard',{
    //                 method:"GET",
    //                 credentials: "include"
    //             })
    //             const result = await response.json()
    //             if(response.status == 401) return navigate('/login')
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }
    //     getData()
    // },[])
    return (
        <>
            <Home />
        </>
    )
}