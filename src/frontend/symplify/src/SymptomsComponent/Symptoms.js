import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Symptoms.css';

function Symptoms() {
    const [searchInput, setSearchInput] = useState("");
    const [querySymptoms, setQuerySymptoms] = useState([]);
    const [userSymptoms, setUserSymptoms] = useState([]);
    const [username, setUsername] = useState([]);
    const [popularSymptoms, setPopularSymptoms] = useState([]);

    async function fetchSymptoms()  {
        try {
            const response = await fetch('http://127.0.0.1:5000/user_symptom', {
                method: 'GET',
                credentials: 'include'
            }
            )
            const symptoms = await response.json();
            setUserSymptoms(symptoms);
        }
        catch (error) {
            console.log(error);
        }
    };

    // Use this hook for first runtime processes
    useEffect(() => {
        async function fetchUsername()  {
        try {
            const response = await fetch('http://127.0.0.1:5000/whoami', {
                method: 'GET',
                credentials: 'include'
            }
            )
            const user = await response.text();
            setUsername(user);
        }
        catch (error) {
            console.log(error);
        }
        }
        fetchUsername();

        // Load current symptoms
        fetchSymptoms();

        // Load popular symptoms
        async function fetchPopularSymptoms()  {
            try {
                const response = await fetch('http://127.0.0.1:5000/popular_symptoms', {
                    method: 'GET'
                }
                )
                const data = await response.json();
                setPopularSymptoms(data);
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchPopularSymptoms();
    }, [])

    const handleChange = (e) => {
        setSearchInput(e.target.value.toLowerCase());
    }; 

    const handleSymptomDelete = (trackableID) => {
        // /delete_usertrack
        const data = {
            trackableId: trackableID
        }
        fetch('http://127.0.0.1:5000/delete_usertrack', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
            credentials: 'include',
            body: JSON.stringify(data)
            })
            .then(response => {
                if (response.status >= 400 && response.status < 600) {
                    throw new Error("Bad response from server");
                }
                console.log(response);
                // Account successfully made -> redirect
                fetchSymptoms();
            })
            .catch(error => {
                console.error(error);
            }); }

    const handleSymptomRoute = (trackableID) => {
        window.open(`/symptom/${trackableID}`, '_start')
    }

    const handleSymptomInsert = (trackableID) => {
        // make a request to add user tracks (trackableId, username)
        var data = {
            table: "UserTracks",
            username: username,
            trackable_id: trackableID
        }

        fetch('http://127.0.0.1:5000/insert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
        credentials: 'include',
        body: JSON.stringify(data)
        })
        .then(response => {
            if (response.status >= 400 && response.status < 600) {
                throw new Error("Bad response from server");
            }
            console.log(response);
            // Account successfully made -> redirect
            fetchSymptoms();
        })
        .catch(error => {
            console.error(error);
        }); }

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
      <input className="searchbar"
          type="search"
          placeholder={"search for symptoms..."}
          onChange={handleChange}
          value={searchInput} />
        <div>
        <h2>Add the below symptoms:</h2>
        <div id="symptomsContainer">
            {querySymptoms.map((l) => {
                return (<div> 
                <button id="symptomBox" onClick={() => handleSymptomRoute(l.trackableId)}>
                    {l.trackableName}
                </button>
                <button id="symptomBox" onClick={() => handleSymptomInsert(l.trackableId)}>
                +
                </button>
                </div>
            )}
            )}    
            </div>
        </div>
        <div>
        <h2>Your current symptoms:</h2>
        <div id="symptomsContainer">
            {userSymptoms.map((l) => {
                return ( 
                <div className="singleContainer">
                <button id="symptomBox" onClick={() => handleSymptomRoute(l.trackableId)}>
                    {l.trackableName}
                </button>
                <button id="symptomBox" onClick={() => handleSymptomDelete(l.trackableId)}>
                -
                </button>
                </div>
            )}
            )}    
            </div>
        <h2>Here are some popular symptoms: </h2>
        <div className="popularBox">
        <table className="symptomTable">
            <thead>
            <tr>
                <th>Symptom</th>
                <th>Number of Related Diagnoses</th>
            </tr>
            </thead>
            <tbody>
                {popularSymptoms.map((item) => (
                <tr key={item.id}>
                <td>{item.symptom}</td>
                <td>{item.numDiagnoses}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
        </div>
    </div>
  );
}

export default Symptoms;