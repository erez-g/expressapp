import React from 'react';
import {NavLink} from 'react-router-dom';

export const Navbar = () => {
  return (
    <>
    <div id="navbar">
          <div id="brand">
            Songrr
          </div>
        <nav>
        <li>
          <NavLink 
            to="/"
            className={({isActive})=>
              (isActive ? 'active' : '')
            }>
              Home</NavLink></li>
        {/*<li>
          <NavLink 
            to="create"
            className={({isActive})=>
              (isActive ? 'active' : '')
            }>
            Create</NavLink></li> */}
        <li>
          <NavLink 
            to="about"
            className={({isActive})=>
              (isActive ? 'active' : '')
            }>
            About</NavLink></li>
        </nav>     
    </div>   
    </>
  )
}

export default Navbar;