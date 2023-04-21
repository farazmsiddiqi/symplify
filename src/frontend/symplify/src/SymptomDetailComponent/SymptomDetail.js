import './SymptomDetail.css';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SymptomDetail() {
    const [trackableName, setTrackableName] = useState("");
    const {id} = useParams(); // trackable ID of symptom
    const [updatedName, setUpdatedName] = useState('');
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
    useEffect(() => {
        fetchTrackableName();
    }, []);

    const handleUpdate = (e) => {
        e.preventDefault();
        const data = {
            symptomName: updatedName,
            trackableId: id 
        }

        fetch('http://127.0.0.1:5000/update_symptom', {
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
            setTrackableName(updatedName);
        })
        .catch(error => {
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
        var url = "https://www.google.com/search?q=" + encodeURIComponent(query) + "&num=" + numResults;

        if (query == "") {
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
                    Rename this symptom: &ensp;
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
        </div>
    );
}

export default SymptomDetail;