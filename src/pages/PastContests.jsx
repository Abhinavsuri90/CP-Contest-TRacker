import { useState, useEffect } from 'react'
import ContestList from '../components/ContestList'
import { getPastContests } from '../utils/api'

function PastContests() {
  const [contests, setContests] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const pastContests = await getPastContests()
        setContests(pastContests)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching past contests:', error)
        setLoading(false)
      }
    }
    
    fetchContests()
  }, [])
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading past contests...</p>
      </div>
    )
  }
  
  return (
    <div className="past-contests-page">
      <ContestList 
        contests={contests} 
        title="Past Contests" 
        subtitle="Previous competitive programming contests"
      />
    </div>
  )
}

export default PastContests