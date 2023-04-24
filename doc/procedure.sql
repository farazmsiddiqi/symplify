
CREATE PROCEDURE PercentTreatmentsUsers(
  IN symptomId INT
)
BEGIN
  DECLARE varNumUsers INT;
  DECLARE varTrackableName VARCHAR(255);
  DECLARE varTotalUsers INT DEFAULT 0;
  DECLARE varPercent FLOAT;
  
  DECLARE exit_loop BOOLEAN DEFAULT FALSE;

  DECLARE cur CURSOR FOR (
    SELECT DISTINCT trackable_name, COUNT(DISTINCT username) as num_users
    FROM Treatment NATURAL JOIN UserTracks
    WHERE username IN (
      SELECT DISTINCT username
      FROM Symptom NATURAL JOIN UserTracks 
      WHERE trackable_id = symptomId)
    GROUP BY trackable_name
    ORDER BY num_users DESC
    LIMIT 30
  );

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET 
    exit_loop = TRUE;

  SELECT COUNT(DISTINCT username) INTO varTotalUsers
  FROM Symptom NATURAL JOIN UserTracks
  WHERE trackable_id = symptomId
  GROUP BY trackable_id;

  DROP TABLE IF EXISTS TreatmentCounts;

  CREATE TABLE TreatmentCounts (
    treatment_name VARCHAR(255) PRIMARY KEY,
     percent FLOAT
  );

  OPEN cur;
    cloop: LOOP
    FETCH cur INTO varTrackableName, varNumUsers;
    IF exit_loop
     THEN LEAVE cloop;
    END IF;
  
  IF varTotalUsers = 0.0 THEN
    SET varPercent = 0.0;
  ELSE
    SET varPercent = (varNumUsers/varTotalUsers) * 100.0;
  END IF;
  
  INSERT IGNORE INTO TreatmentCounts(treatment_name, percent)
   VALUE (varTrackableName, varPercent);
  END LOOP cloop;
  CLOSE cur;

  SELECT treatment_name, ROUND(percent, 2)
  FROM TreatmentCounts
  ORDER BY percent DESC
  ;

END;

