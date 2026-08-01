import { useEffect, useState } from 'react'
import Admin from '../../component/AdminOld/Admin'
import { useNavigate } from 'react-router-dom'
function AdminPage (){
    const [places,setPlaces] = useState([])
    const navigate = useNavigate()
    useEffect(()=>{
        const getData = async ()=>{
            const response = await fetch('http://localhost:3000/admin',{
                method:"GET",
                credentials: "include"
            })
            if(response.status==401) return navigate('/login')
            const result = await response.json()
            if(result.status) setPlaces(result.result)
        }
        getData()
    },[])
    return(
        <>
        <Admin places={places}/>
        </>
    )
}
export default AdminPage