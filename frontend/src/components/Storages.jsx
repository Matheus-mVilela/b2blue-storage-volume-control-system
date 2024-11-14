import { fetchStorages } from '../api'
import { useQuery } from '@tanstack/react-query'


export default function Storages() { 
    const {data:storages} = useQuery(
        {queryFn: fetchStorages, queryKey: ['storages']}
    )   
    return <ul>{storages?.map((storage)=><li key={storage.id}>{storage.id}</li>)}</ul>
    
}