## Explain your choice for the advanced database program and how it is suitable for your application. For example, if you chose a stored procedure+trigger, explain how this choice is suitable for your application.

Our advanced database program includes two features.
The first feature (trigger) allows admin privileges to rename symptoms. This is suitable for our application because the Symptoms are defined by user data and contains many typos and irregular characters. Thus, renaming these symptoms would increase user experience. Specifically, it makes sense to add admin privilege so not any user can rename symptoms. This would create issues because a non-admin would be able to rename symptoms to something unrelated and change someone else's saved symptoms.

The other feature is calculating percents of users using a treatment for common symptoms. This is really helpful for users to find out what treatments they can look into for their symptoms.

A transaction doesn't make sense for us because users don't have the ability to have overlapping/interferring read and writes.

## How did the creative element add extra value to your application?
Our creative element, the google search API, added value to our application by enabling the user to learn more about their novel symptom from a trusted source: Mayo Clinic. This solution represents a one-stop-shop avenue for users to learn about this symptom. This feature is **ESPECIALLY** important for our target demographic, older citizens (65+), because they are not well versed with the internet and are more likely to ingest misinformation regarding their symptom. By having a Symplify vetted source for senior citizens, we are combatting misinformation in the medical world and providing truth to our target demographic. 

## How would you want to further improve your application? In terms of database design and system optimization?
Generally, we could include an LSTM (Long Short Term Memory Model) to optimize on the number of queries required to display symptom data. This would work by taking in time-series data to predict which tables and which attributes are most commonly queried, and predictively update a cache of 'most used' indices. 
In the future, our database design would benefit from separating our UserTracks and User information between real users and the Kaggle Dataset Users. This would decrease runtime for querying the dataset. We would also add features to insert new symptoms.

## What were the challenges you faced when implementing and designing the application? How was it the same/different from the original design?

We found the stored procedure difficult because it required thinking of new advanced subqueries. Similarly, thinking of interactions to occur for the Trigger was difficult since our inserts/deletes don't have many consequences.
Additionally, we struggled with OAuth/CORS issues that we were new to in our backend. Finally, we also struggled with indexing since we couldn't tell if our lack of improvement was due to developer error or the shape of our data.

It was different from the original design because we dropped a lot of irrelevant data like demographics and check-in date. We decided that it was not relevant for people to add symptoms and find treatments. On top of that, we wanted to reduce memory requirements by removing unnecessary data. We also realized the challenges of diagnosing a condition since this would require outside algorithms which would be difficult. 


## If you were to include a NoSQL database, how would you incorporate it into your application?
We would use a Graph database to connect users with symptoms and conditions. This would reduce the complexity required to associate users with symptoms, conditions, or treatments because we would be able to avoid doing large joins between these tables and remove the need for a UserTracks table (many-many relationship table).
