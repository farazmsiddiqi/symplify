import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Symptoms.css';

function Symptoms() {
    const [searchInput, setSearchInput] = useState("");
    const [querySymptoms, setQuerySymptoms] = useState([]);
    const [userSymptoms, setUserSymptoms] = useState([]);
    const [username, setUsername] = useState([]);

    useEffect(() => {
        async function fetchUsername()  {
        try {
            const response = await fetch('http://127.0.0.1:5000/whoami', {
                method: 'GET',
                credentials: 'include'
            }
            )
            const user = await response.data;
            setUsername(user);}
        catch (error) {
            console.log(error);
        }
        }
        fetchUsername();
    }, [])

    const handleChange = (e) => {
        setSearchInput(e.target.value.toLowerCase());
    }; 

    const handleSymptomInsert = (trackableId) => {
        // make a request to add user tracks (trackableId, username)
    };

    useEffect(() => {
        if (searchInput.length > 0) {
            async function fetchData() {
                try {
                    var url = new URL('http://127.0.0.1:5000/search_symptom')
                    const params = new URLSearchParams({
                        searchSymptom: searchInput
                    })
                    url.search = params.toString();
                    const response = await fetch(url)
                    const json = await response.json();;
                    setQuerySymptoms(json);
                } catch (error) {
                    console.log(error);
                }
            }
            fetchData();
        } else {
            setQuerySymptoms([]);
        }
    }, [searchInput]);


    return (
    <div>
      <h1>Symptoms</h1>
      {username}
      <input className="searchbar"
          type="search"
          placeholder={"search for symptoms..."}
          onChange={handleChange}
          value={searchInput} />
        <div>
        <h2>Add the below symptoms:</h2>
        <div id="symptomsContainer">
            {querySymptoms.map((l) => {
                return (
                <button id="symptomBox" onClick={handleSymptomInsert(l.trackableId)}>
                    {l.trackableName}
                </button>
            )}
            )}    
            </div>
        </div>
        <div>
        <h2>Your current symptoms:</h2>
        </div>
    </div>
  );
}

export default Symptoms;