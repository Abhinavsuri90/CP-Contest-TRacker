import { useState } from 'react'
import ContestCard from './ContestCard'
import '../styles/ContestList.css'

function ContestList({ contests, title, subtitle }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPlatform, setFilterPlatform] = useState('all')
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }
  
  const handlePlatformChange = (e) => {
    setFilterPlatform(e.target.value)
  }
  
  const filteredContests = contests.filter(contest => {
    const matchesSearch = contest.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlatform = filterPlatform === 'all' || contest.platform.toLowerCase() === filterPlatform
    
    return matchesSearch && matchesPlatform
  })
  
  return (
    <div className="contest-list-container">
      <div className="contest-list-header">
        <div className="contest-list-titles">
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        
        <div className="contest-filters">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search contests..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          
          <div className="platform-filter">
            <select value={filterPlatform} onChange={handlePlatformChange} className="platform-select">
              <option value="all">All Platforms</option>
              <option value="codeforces">Codeforces</option>
              <option value="leetcode">LeetCode</option>
              <option value="atcoder">AtCoder</option>
              <option value="codechef">CodeChef</option>
              <option value="hackerrank">HackerRank</option>
              <option value="hackerearth">HackerEarth</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredContests.length > 0 ? (
        <div className="contest-grid">
          {filteredContests.map(contest => (
            <div className="contest-grid-item" key={contest.id}>
              <ContestCard contest={contest} />
            </div>
          ))}
        </div>
      ) : (
        <div className="no-contests">
          <p>No contests found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default ContestList