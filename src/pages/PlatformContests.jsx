import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ContestList from '../components/ContestList'
import { getPlatformContests } from '../utils/api'

function PlatformContests() {
  const { platformId } = useParams()
  const [contests, setContests] = useState([])
  const [loading, setLoading] = useState(true)
  
  const getPlatformName = (id) => {
    const platforms = {
      codeforces: 'Codeforces',
      leetcode: 'LeetCode',
      atcoder: 'AtCoder',
      codechef: 'CodeChef',
      hackerrank: 'HackerRank',
      hackerearth: 'HackerEarth'
    }
    
    return platforms[id] || id
  }
  
  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true)
        const platformContests = await getPlatformContests(platformId)
        setContests(platformContests)
        setLoading(false)
      } catch (error) {
        console.error(`Error fetching ${platformId} contests:`, error)
        setLoading(false)
      }
    }
    
    fetchContests()
  }, [platformId])
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading {getPlatformName(platformId)} contests...</p>
      </div>
    )
  }
  
  return (
    <div className="platform-contests-page">
      <ContestList 
        contests={contests} 
        title={`${getPlatformName(platformId)} Contests`} 
        subtitle={`All contests from ${getPlatformName(platformId)}`}
      />
    </div>
  )
}

export default PlatformContests