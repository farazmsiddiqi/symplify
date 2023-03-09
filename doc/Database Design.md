## DDL Commands
```SQL
CREATE TABLE KaggleTopLevel (
user_id VARCHAR(255) NOT NULL,
age INT,
sex VARCHAR(255),
country VARCHAR(255),
checkin_date Date,
trackable_id INT,
trackable_type VARCHAR(255),
trackable_name VARCHAR(255),
trackable_value VARCHAR(255),
PRIMARY KEY(user_id)
);

CREATE TABLE Diagnosis (
trackable_id INT NOT NULL,
trackable_name VARCHAR(255),
trackable_value VARCHAR(255),
FOREIGN KEY (trackable_id) REFERENCES Trackable(trackable_id)
);

CREATE TABLE Symptom (
trackable_id INT NOT NULL,
trackable_name VARCHAR(255),
trackable_value VARCHAR(255),
FOREIGN KEY (trackable_id) REFERENCES Trackable(trackable_id)
);

CREATE TABLE Treatment (
trackable_id INT NOT NULL,
trackable_name VARCHAR(255),
trackable_value VARCHAR(255),
FOREIGN KEY (trackable_id) REFERENCES Trackable(trackable_id)
);

CREATE TABLE Tag (
trackable_id INT NOT NULL,
trackable_name VARCHAR(255),
FOREIGN KEY (trackable_id) REFERENCES Trackable(trackable_id)
);

CREATE TABLE Weather (
trackable_id INT NOT NULL,
trackable_name VARCHAR(255),
trackable_value VARCHAR(255),
FOREIGN KEY (trackable_id) REFERENCES Trackable(trackable_id)
);

CREATE TABLE Trackable (
trackable_id INT NOT NULL,
trackable_type VARCHAR(255),
PRIMARY KEY (trackable_id)
);
```

# Advanced Queries
Please see doc/query1.png and doc/query2.png for output.
```SQL
SELECT s.trackable_name as Symptom, COUNT(d.trackable_name) as NumDiagnoses
FROM Symptom s LEFT JOIN Diagnosis d ON (s.trackable_id = d.trackable_id)
GROUP BY s.trackable_name
ORDER BY NumDiagnoses DESC
LIMIT 15;


SELECT d.trackable_name as Diagnosis, t.trackable_name as Treatment, COUNT(t.trackable_name) as NumTreatments, t.trackable_value as Dosage
FROM Treatment t RIGHT JOIN Diagnosis d ON (t.trackable_id = d.trackable_id)
WHERE t.trackable_name IS NOT NULL
GROUP BY d.trackable_name, t.trackable_name, t.trackable_value
ORDER BY NumTreatments DESC
LIMIT 15;
```
