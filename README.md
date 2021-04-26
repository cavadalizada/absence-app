# Qayib API docs 

# LAST UPDATED 3/5/2021

### Extension routes

#### Will be used by extension only

1. GET _/checkForQayib_

    experimental to be improved.

    used to control the extension. 


2. GET _/getToken_

    development purposes only

    requires student id[studentId], returns a jwt token created from it

### Authentication routes


1. POST _auth/{type}/login_

    access requires the user to be verified

    * administrator - requires [email], [password]  

    * teacher - requires [email], [password]

    returns jwt token


2. POST _auth/{type}/register_

    * administrator(owner) - requires [email], [username], [password]

    * teacher - requires [email], [username], [password]



3. POST _auth/{type}/verify_

    Some security problems exist regarding verify code i know

    (used by email link)

    * administrator - requires verification code [verfiyCode] and username [username] as params

    * teacher - requires verification code [verfiyCode] and username [username] as params

    checks the code if mathces user is verified 

4. POST _auth/administrator/createTeachers_

     requires valid jwt token of verified administrator who has a university

     takes in emails if teacher not registered creates a random password adds them the the university and emails them their login credentials.



### University routes 


__All require Bearer type auth header with valid jwt__



1. POST _/university/create_ 

    access requires administrator jwt token

    requires name [name], domain [domain] (for now) returns randomly generated data to be inputted to dns records

2. POST _/university/verify_            [TODO]

    access requires administrator jwt token

    checks the domain to see if it is verified, if so sets university.isVerified to true


__Below endpoints require university domain to be verified__


3. POST _university/isPresent_

    used by the extension
    *Option1* requires jwt token [jwt], sets the student present for their enrolled lesson currently taking place

    *Option2* requires jwt token [jwt] and name of subject [subject] sets the student present for the lesson of the subject currently taking place



2. POST _university/addSubject_ 

    requires subject name [name], creates a corresponding subject



3. POST _university/addStudent_

    requires first name [firstname], last name [lastname] and enrolled lessons array [enrolledLessons]. Creates a student using the data.



4. POST _university/addLesson_

    requires the date the lesson will take place [date] and the name of the subject [subject], creates the corresponding lesson and also initilializes an attendance for that lesson


5. GET _university/showAttendance_

    requires the time the lesson took place [date] and name of the subject [subject], returns the complete list of attendance for all enrolled students
