
import './App.css'
import ChatPage from './Pages/ChatPage'
import Home from './Pages/Home'
import { BrowserRouter,Routes, Route} from 'react-router-dom'
import ChatProvider from './Context/ChatProvider.jsx'

function App() {
  return (
    <div className='App'>
    <BrowserRouter>
      <ChatProvider>
      <Routes>
        <Route path='/' element={<Home></Home>}/>
        <Route path='/chat' element={<ChatPage></ChatPage>}/>

      </Routes>
      </ChatProvider>  
    </BrowserRouter>
    </div>
  )
}

export default App
