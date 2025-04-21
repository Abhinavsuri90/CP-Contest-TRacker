import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import UpcomingContests from './pages/UpcomingContests'
import PastContests from './pages/PastContests'
import PlatformContests from './pages/PlatformContests'
import './styles/App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upcoming" element={<UpcomingContests />} />
          <Route path="/past" element={<PastContests />} />
          <Route path="/platform/:platformId" element={<PlatformContests />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>CP Contest Tracker © {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App