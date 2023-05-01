### Please list out changes in the directions of your project if the final project is different from your original proposal (based on your stage 1 proposal submission).

One difference in our final project and our proposal is the implementation and usage of personal demographic and profile data. This is because we didn’t find this profile useful to the core application, and we wanted to focus on improving our product for important features instead.
Another difference is that we removed the “diagnosis” feature, where we wanted to take a user’s input symptoms and give suggested conditions. We removed this because we realized it was dangerous to make diagnoses for users online without medical backgrounds and thought that this tool could be used tangentially to conditions by focusing on a user’s symptoms instead.
We also added some additional features not present in our original proposal, like statistics across conditions, treatments, and users to obtain a more nuanced understanding of the symptoms a user is experiencing.
Overall, our direction of the project stayed pretty consistent, as this was still a tool for users to track and learn more about symptoms they are experiencing. But instead of being a tool to diagnose, it became a tool to learn more about their symptoms, conditions, and what people like them are experiencing and treating.

### Discuss what you think your application achieved or failed to achieve regarding its usefulness.

Our application was overall successful in providing our audience with more information regarding their symptoms, and offering potential diagnoses based on their symptoms. This was our goal from the start, and we managed to achieve that goal. We failed to achieve a highly specific diagnostic tool, so our website cannot be used alone for diagnoses. This was mainly because of the unstructured nature of symptoms that users were allowed to input. It is hard to relate a symptom to a diagnosis when the user can input the symptom instead of choosing it from a list. 

### Discuss if you changed the schema or source of the data for your application

Removed user_id and replaced this with the username as a primary key. Originally, we had a user_id that was a unique identifier between all users. But then we realized it didn’t make sense for users to have a unique user_id and a unique username, so we used the username attribute instead. Additionally, for some tables we had to adjust the primary keys. For example, in our top level dataset (the original data from the csv transported to a big table), we went from having the username to being the only primary key, to the primary key being username, trackable_name, trackable_id, trackable_value, so that we weren’t accidentally limiting the users to one row each from the original data.

### Discuss what you change to your ER diagram and/or your table implementations. What are some differences between the original design and the final design? Why? What do you think is a more suitable design? 

There were no significant changes to the diagram structure. One thing is that we deleted the Tag, Weather, and Demographics tables since we ended up not finding any meaningful uses for this data. Because this data is user generated, there were a lot of inconsistencies within the Tag data fields. Additionally, none of this affected our core product so it was unnecessary to include. This is a more suitable design because it didn’t make sense to store data that isn’t used in our application, even if it was in our original dataset. 

### Discuss what functionalities you added or removed. Why?

We added functionality to search for a symptom on Mayo clinic, rename a symptom, and find related diagnoses based on the symptom that is being currently viewed. This was mainly to provide the user with more information regarding which symptoms they are viewing, to allow them to find which diagnoses they may be encountering. We removed functionality related to a direct diagnosis because it is not recommended for a website to diagnose a user. This should be left up to doctors. As previously stated, we also remove the profile features. This is because setting up and populating data on a profile is not a vital piece of our application, and does not add much value to our tool.

### Explain how you think your advanced database programs complement your application.

There are three advanced database programs within our application, namely a stored procedure, a trigger and independent advanced queries. The advanced queries and stored procedures allow us to make complex extrapolations of the data and present them to the user. This includes statistics about what conditions and treatments similar users are experiencing with their symptoms. The trigger provides a convenient admin check for updates into our Symptom table, allowing us to further guarantee the integrity of the data. Without this, users would be able to make any changes to the symptom names, good or bad.

### Each team member should describe one technical challenge that the team encountered.  This should be sufficiently detailed such that another future team could use this as helpful advice if they were to start a similar project or where to maintain your project. 

Faraz: One technical challenge that our team encountered on the backend was CORS authentication. Cross Origin Resource Sharing (CORS) is a method that allows restricted resources on a web page to be requested from another domain. We ran into a CORS issue when our backend asked for user input information from our frontend. This was tricky to understand, but reading CORS documentation and adding CORS authorization on the backend with Flask and Python helped us fix the issue.

Minh: We encountered difficulties with setting up a stored procedure, taking extended time to fix the errors our implementation encountered. This mainly stems from our lack of experience with this database feature, causing us to have to look thoroughly through past class assignments and online documentations. A major problem was the declaration of variables, as we did not know variables all have to be declared before the main procedure body.

Effie: A recurring technical challenge throughout the project was making sure our schemas were exactly in the form we needed it. For example, in some situations, we didn’t have enough primary keys for data, even though it makes sense for a user to have multiple pieces of information. We realized very late in our project that our top level dataset table had username as a primary key, which limited our dataset by orders of magnitude, to only include one row for each user from the original dataset. We went from thousands of entries in our data to million+. The more we learned about how our data was created and what we wanted to do with it, the more we went back and tweaked our tables. Most of the issues we encountered with our database was being purposeful with our primary keys and making sure we used enough attributes as primary keys when appropriate. 

### Are there other things that changed comparing the final application with the original proposal?

As mentioned, we removed many features and tables from our original proposal. But since our direction and data stayed the same, nothing drastic changed that hasn’t already been mentioned.

### Describe future work that you think, other than the interface, that the application can improve on.

The application can improve on providing information to the user regarding a symptom. Right now, we have functionality that allows the user to search the symptom online and receive results from Mayo Clinic. We can improve this to pull information regarding a symptom directly in the Symplify website without having to leave the webpage. This can either be through generative AI or through a simple API call to a medicinal website.
Additionally, we think it would be beneficial to split our tables into dataset user data and our program’s user data. This is because it would be quicker to query data for our users, since even the table with our passwords is populated with all the dataset users.

### Describe the final division of labor and how well you managed teamwork.

Effie: Mostly frontend and building the tables and data in GCP.
Faraz: Mostly backend (routing, calling, etc) with a bit of frontend logic (request handling).
Minh: Mostly backend and working with the database.

Overall, we all distributed the teamwork very evenly. All project work was completed in a group setting in-person, so we utilized peer programming for the entire project, where we each had expertise in different areas.
