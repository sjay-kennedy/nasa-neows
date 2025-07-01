
"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";

function Header(props: any) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    document.documentElement.classList.toggle('bg-base-300', dark);
    document.documentElement.classList.toggle('bg-pink', !dark);
  }, [dark]);
  return (
   <div className="navbar bg-base-100 shadow-sm flex justify-between items-center gap-2 sticky top-0 z-50">
        <div className="navbar-start">
            <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                </div>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                    {/* <li><Link href="/browse">Browse Asteroids</Link></li>
                    <li><Link href="/graphics">Relative Size</Link></li> */}
                </ul>
            </div>
            <Link className={dark === true ? "btn btn-ghost text-xl text-secondary" : "btn btn-ghost text-xl text-dark-pink"} href="/">Asteroid Tracker</Link>
            
        </div>
        <div className="navbar-center hidden 2xl:flex">
            <ul className="menu menu-horizontal px-1">
                {/* <li><Link href="/browse">Browse Asteroids</Link></li>
                <li><Link href="/graphics">Relative Size</Link></li> */}
            </ul>
        </div>
        <div className="navbar-end mr-4">
             <label>
          <span className="pr-2">Dark Theme</span>
          <input
            type="checkbox"
            className="toggle theme-controller"
            checked={dark}
            onChange={() => setDark(d => !d)}
            aria-label="Toggle dark mode"
          />
        </label>
      </div>
    </div>
  );
}

export default Header;
