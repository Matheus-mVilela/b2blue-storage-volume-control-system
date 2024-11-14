import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import Storages from './components/Storages'


const queryClient = new QueryClient()


function App() {
  
  return (
    <QueryClientProvider client={queryClient}>
      <Storages/>
    </QueryClientProvider>
  )
}

export default App
