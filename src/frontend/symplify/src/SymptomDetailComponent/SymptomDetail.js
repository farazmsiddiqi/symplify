import './SymptomDetail.css';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SymptomDetail() {
    const [trackableName, setTrackableName] = useState("");
    const {id} = useParams(); // trackable ID of symptom
    const [updatedName, setUpdatedName] = useState('');
    const [diagnoses, setDiagnoses] = useState([]);
    const [username, setUsername] = useState('');
    const [treatmentPercents, setTreatmentPercents] = useState([]);

    async function fetchTrackableName()  {
        var strId = parseInt(id)
        try {
            const response = await fetch(`http://127.0.0.1:5000/symptom_name?trackableId=${strId}`)
            const trackable_name = await response.text();
            setTrackableName(trackable_name);
        }
        catch (error) {
            console.log(error);
        }
    };

    async function fetchTreatmentPercents() {
        var strId = parseInt(id)
        try {
            const response = await fetch(`http://127.0.0.1:5000/symptom_procedure?trackableId=${strId}`)
            const data = await response.json();
            setTreatmentPercents(data);
        }
        catch (error) {
            console.log(error);
        }
    }

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


    useEffect(() => {
        fetchUsername();
        fetchTrackableName();
        fetchTreatmentPercents();
    }, []);

    const handleUpdate = (e) => {
        e.preventDefault();
        const data = {
            symptomName: updatedName,
            trackableId: id,
            user: username
        }

        fetch('http://127.0.0.1:5000/update_symptom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
            credentials: 'include',
            body: JSON.stringify(data)
        })
        .then(async response => {
            if (response.status >= 400 && response.status < 600) {
                const text = await response.text()
                throw new Error(text);
            }
            console.log(response);
            setTrackableName(updatedName);
        })
        .catch(error => {
            window.alert(error);
            console.error(error);
        });
    }

    const handleInputChange = (event) => {
        setUpdatedName(event.target.value);
    };

    const performSearch = () => {
        // Get the search query entered by the user
        var query = document.getElementById("searchQuery").value;

        // Set the number of search results to retrieve
        var numResults = 10;

        // Construct the Google search URL
        var url = "https://www.google.com/search?q=" + "from:mayo clinic what is the symptom: " + encodeURIComponent(query) + "&num=" + numResults;

        if (query === "") {
            window.alert("You didn't search anything! Type a symptom into the box to search it up.")
            return;
        }

        // Open the Google search URL in a new window
        window.open(url, "_blank");
    }


    return (
        <div>
            <input type="button" className='back-button' value="Back" onClick={() => window.open("/symptoms", "_start")}/> 
            <h1>{trackableName}</h1>
            <form onSubmit={handleUpdate}>
                <label>
                 (ADMIN ONLY) Rename this symptom: &ensp;
                    <input type="text" className='submitBar' value={updatedName} onChange={handleInputChange}/>
                </label>
                <button className='submit-button' type="submit">Submit</button>
            </form>
            
            <div>
                <label>
                    Search this symptom: &ensp;
                </label>
                <input type="text" className='searchBar' id="searchQuery" placeholder="ex: headache" />
                <button className='search-button' onClick={performSearch}>Search</button>
            </div>
            <ul id="searchResults"></ul>
            <br></br>
            <h2>Top Treatments</h2>
            <span>These are the percent of users experiencing "{trackableName}" who use each of the below top treatments.</span>
            <div className="diagnosisBox">
            <table>
            <thead>
            <tr>
                <th>Treatments Name</th>
                <th>Percent of Users</th>
            </tr>
            </thead>
            <tbody>
                {treatmentPercents.map((item) => (
                <tr key={item}>
                <td>{item.treatmentName}</td>
                <td>{`${item.percent}%`}</td>
                </tr>
            ))}
            </tbody>
            </table>
            </div>
        </div>
    );
}

export default SymptomDetail;