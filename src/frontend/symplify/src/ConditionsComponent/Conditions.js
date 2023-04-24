import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Conditions.css';

function Conditions() {
    const [conditionsTreatments, setConditionsTreatments] = useState([]);
    
    useEffect(() => {
        // Load popular symptoms
        async function fetchConditionsTreatments()  {
            try {
                const response = await fetch('http://127.0.0.1:5000/conditions_treatments', {
                    method: 'GET'
                }
                )
                const data = await response.json();
                setConditionsTreatments(data);
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchConditionsTreatments();
    }, [])
    return (
        <div>
        <h1>Conditions</h1>
        <h2>Common Treatments for Diagnoses</h2>
        <p>Here are some of the most common treatments for diagnoses. Please note that the user count is unique to the treatment and diagnoses pair.</p>
        <div className="popularBox">
        <table>
            <thead>
            <tr>
                <th>Diagnosis</th>
                <th>Treatment</th>
                <th>Number of Users of this Treatment</th>
                <th>Dosage</th>
            </tr>
            </thead>
            <tbody>
                {conditionsTreatments.map((item) => (
                <tr key={item.id}>
                <td>{item.diagnosis}</td>
                <td>{item.treatment}</td>
                <td>{item.numTreatments}</td>
                <td>{item.dosage}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
            
           
        </div>
    )

};
export default Conditions;