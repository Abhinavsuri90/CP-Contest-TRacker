import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ContestList from '../components/ContestList'
import ContestCard from '../components/ContestCard'
import { 
  getUpcomingContests, 
  getPastContests, 
  getOngoingContests 
} from '../utils/api'
import '../styles/Dashboard.css'

function Dashboard() {
  const [upcomingContests, setUpcomingContests] = useState([])
  const [pastContests, setPastContests] = useState([])
  const [ongoingContests, setOngoingContests] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const [upcoming, past, ongoing] = await Promise.all([
          getUpcomingContests(),
          getPastContests(),
          getOngoingContests()
        ])
        
        setUpcomingContests(upcoming.slice(0, 6)) // Show only first 6
        setPastContests(past.slice(0, 3)) // Show only first 3
        setOngoingContests(ongoing)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching contests:', error)
        setLoading(false)
      }
    }
    
    fetchContests()
  }, [])
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading contests...</p>
      </div>
    )
  }
  
  return (
    <div className="dashboard">
      <section className="hero-section">
        <h1 className="hero-title">Competitive Programming Contest Tracker</h1>
        <p className="hero-subtitle">
          Stay updated with upcoming, ongoing, and past programming contests 
          from various competitive programming platforms.
        </p>
      </section>
      
      {ongoingContests.length > 0 && (
        <section className="ongoing-contests-section">
          <div className="section-header-highlight">
            <h2 className="ongoing-title">Ongoing Contests</h2>
            <span className="live-indicator">LIVE</span>
          </div>
          <div className="ongoing-contests-grid">
            {ongoingContests.map(contest => (
              <div className="ongoing-contest-item" key={contest.id}>
                <ContestCard contest={contest} />
              </div>
            ))}
          </div>
        </section>
      )}
      
      <section className="upcoming-contests-section">
        <div className="section-header-with-link">
          <h2 className="section-title">Upcoming Contests</h2>
          <Link to="/upcoming" className="view-all-link">
            View All <span className="arrow">→</span>
          </Link>
        </div>
        <ContestList 
          contests={upcomingContests} 
          title="" 
        />
      </section>
      
      <section className="past-contests-section">
        <div className="section-header-with-link">
          <h2 className="section-title">Recent Past Contests</h2>
          <Link to="/past" className="view-all-link">
            View All <span className="arrow">→</span>
          </Link>
        </div>
        <ContestList 
          contests={pastContests} 
          title="" 
        />
      </section>
      
      <section className="platforms-section">
        <h2 className="section-title">Browse by Platform</h2>
        <div className="platforms-grid">
          <Link to="/platform/codeforces" className="platform-card" data-platform="codeforces">
            <span className="platform-name">Codeforces</span>
          </Link>
          <Link to="/platform/leetcode" className="platform-card" data-platform="leetcode">
            <span className="platform-name">LeetCode</span>
          </Link>
          <Link to="/platform/atcoder" className="platform-card" data-platform="atcoder">
            <span className="platform-name">AtCoder</span>
          </Link>
          <Link to="/platform/codechef" className="platform-card" data-platform="codechef">
            <span className="platform-name">CodeChef</span>
          </Link>
          <Link to="/platform/hackerrank" className="platform-card" data-platform="hackerrank">
            <span className="platform-name">HackerRank</span>
          </Link>
          <Link to="/platform/hackerearth" className="platform-card" data-platform="hackerearth">
            <span className="platform-name">HackerEarth</span>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Dashboard