import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Security } from './pages/Security'
import { Vulnerabilities } from './pages/Vulnerabilities'
import { Threats } from './pages/Threats'
import { Monitoring } from './pages/Monitoring'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/security" element={<Security />} />
          <Route path="/vulnerabilities" element={<Vulnerabilities />} />
          <Route path="/threats" element={<Threats />} />
          <Route path="/monitoring" element={<Monitoring />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
