import React, { useState, useRef } from 'react';
import axios from 'axios';

const APIURL = 'https://api.github.com/users/';

function App() {
  const searchInputRef = useRef(null); 
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState('');

  const getUser = async (username) => {
  try {
    const { data } = await axios(APIURL + username);
    setUserData(data);
    getRepos(username);
    setError(''); // Clear any previous error
  } catch (err) {
    if (err.response && err.response.status === 404) {
      setError('No profile with this username');
      setUserData(null); // Clear user data
      setRepos([]); // Clear repos
    } else {
      setError('Problem fetching data');
    }
  }
};

  const getRepos = async (username) => {
    try {
      const { data } = await axios(APIURL + username + '/repos?sort=created');
      setRepos(data.slice(0, 5));
    } catch (err) {
      setError('Problem fetching repos');
    }
  };

  const handleSearch = (e) => {
  e.preventDefault();
  const username = searchInputRef.current.value;
  if (username) {
    getUser(username);
  }
};


  return (
    <div className="App p-4">
      
<form class="max-w-md mx-auto" onSubmit={handleSearch}>   
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input type="search" ref={searchInputRef} className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter the Github Username" required />
        <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
    </div>
</form>

      {error && <div className='flex justify-center text-red-500'>{error}</div>}
      {userData && (
        <div className='flex justify-center'>
          <div className="max-w-md pt-3 bg-cyan-100 dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mt-8">
          <div className="flex items-center justify-center">
            <img src={userData.avatar_url} alt={userData.name || userData.login} className="w-24 h-24 rounded-full" />
          </div>
          <div className="user-info p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">{userData.name || userData.login}</h2>
            {userData.bio && <p className="text-black-600 dark:text-gray-300 mb-4">{userData.bio}</p>}
            <ul className="text-gray-600 dark:text-gray-300 flex flex-wrap justify-between">
              <li className='bg-blue-300 mt-1 p-1 rounded border-brown-500'><strong className="font-semibold">{userData.followers}</strong> Followers</li>
              <li className='bg-blue-300 mt-1 p-1 rounded border-brown-500'><strong className="font-semibold">{userData.following}</strong> Following</li>
              <li className='bg-blue-300 mt-1 p-1 rounded border-brown-500'><strong className="font-semibold">{userData.public_repos}</strong> Repos</li>
            </ul>
            <div id="repos" className="mt-4 flex flex-wrap justify-between">
              {repos.map((repo) => (
                <a key={repo.id} href={repo.html_url} className="repo block mt-1 text-white bg-teal-400 p-1 rounded border-black hover:underline font-semibold" target="_blank" rel="noreferrer">
                  {repo.name}
                </a>
              ))}
            </div>
          </div>
        </div>
        </div>
        
      )}
    </div>
  );
}

export default App;
