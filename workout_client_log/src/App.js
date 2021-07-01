import React, { useState, useEffect } from 'react';
import SiteBar from './home/Navbar';
import './App.css';
import Auth from './auth/Auth';
import WorkoutIndex from './workouts/WorkoutIndex';

function App() {
  const [sessionToken, setSessionToken] = useState(''); 

  useEffect(() => { 
    if (localStorage.getItem('token')){
      setSessionToken(localStorage.getItem('token'));
    }
  }, [])

  const updateToken = (newToken) => { 
    localStorage.setItem('token', newToken);
    setSessionToken(newToken);
    console.log(sessionToken);
  }

  const clearToken = () => {
    localStorage.clear();
    setSessionToken('');
  }

  const portectedViews = () => {
    return (sessionToken === localStorage.getItem('token') ? <WorkoutIndex token={sessionToken}/> : <Auth updateToken={updateToken}/>)
  }

  return (
    <div>  
      <SiteBar clickLogout={clearToken}/> 
      {portectedViews()}
    </div>
  );
}

export default App;
