import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Symptoms.css';

function Symptoms() {
    const [searchInput, setSearchInput] = useState("");
    const [querySymptoms, setQuerySymptoms] = useState([]);

    const handleChange = (e) => {
        setSearchInput(e.target.value.toLowerCase());
    }; 

    useEffect(() => {
        if (searchInput.length > 0) {
            var data = {
                "symptomSearch": searchInput
            }
            // Make fetch call to search route 
            fetch('http://127.0.0.1:5000/search_symptom', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                    },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.status >= 400 && response.status < 600) {
                  throw new Error("Bad response from server");
                }
                console.log(response);
                
                // Set received data
            })
            .catch(error => {
                console.error(error);
            });
            // set query symptoms 
        }
    }, [searchInput]);


    return (
    <div>
      <h1>Symptoms</h1>
      {querySymptoms}
      <input className="searchbar"
          type="search"
          placeholder={"search for symptoms..."}
          onChange={handleChange}
          value={searchInput} />

    </div>
  );
}

export default Symptoms;