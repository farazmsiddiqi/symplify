CREATE TRIGGER CheckAdmin 
	BEFORE UPDATE ON Symptom
		FOR EACH ROW
	BEGIN
		SET @admin = (SELECT admin FROM User WHERE username = @user);
		IF @admin = 0 THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = "Update requires admin privileges.";
		END IF;
END;
			