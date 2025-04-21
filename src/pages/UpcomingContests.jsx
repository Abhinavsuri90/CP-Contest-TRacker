import { useState, useEffect } from 'react'
import ContestList from '../components/ContestList'
import { getUpcomingContests } from '../utils/api'

function UpcomingContests() {
  const [contests, setContests] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const upcomingContests = await getUpcomingContests()
        setContests(upcomingContests)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching upcoming contests:', error)
        setLoading(false)
      }
    }
    
    fetchContests()
  }, [])
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading upcoming contests...</p>
      </div>
    )
  }
  
  return (
    <div className="upcoming-contests-page">
      <ContestList 
        contests={contests} 
        title="Upcoming Contests" 
        subtitle={`${contests.length} contests scheduled for the future`}
      />
    </div>
  )
}

export default UpcomingContests