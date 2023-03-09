## DDL Commands

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
