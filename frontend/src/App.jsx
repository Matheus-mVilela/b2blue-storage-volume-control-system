import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import Dashboard from './components/Dashboard'
import { CssBaseline } from '@mui/material'


export const queryClient = new QueryClient()


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CssBaseline/>
      <Dashboard/>
    </QueryClientProvider>
  )
}

export default App
