import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import '../styles/Header.css'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          CP Contest Tracker
        </Link>
        
        <button 
          className={`menu-toggle ${menuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <nav className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={closeMenu}
            end
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/upcoming" 
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={closeMenu}
          >
            Upcoming
          </NavLink>
          <NavLink 
            to="/past" 
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={closeMenu}
          >
            Past
          </NavLink>
          <div className="platform-dropdown">
            <button className="dropdown-button">Platforms</button>
            <div className="dropdown-content">
              <Link to="/platform/codeforces" onClick={closeMenu}>Codeforces</Link>
              <Link to="/platform/leetcode" onClick={closeMenu}>LeetCode</Link>
              <Link to="/platform/atcoder" onClick={closeMenu}>AtCoder</Link>
              <Link to="/platform/codechef" onClick={closeMenu}>CodeChef</Link>
              <Link to="/platform/hackerrank" onClick={closeMenu}>HackerRank</Link>
              <Link to="/platform/hackerearth" onClick={closeMenu}>HackerEarth</Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header