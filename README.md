# bedbugs ![bedbugs](./src/images/blue_bug_thumbnail.svg)

## What can bedbugs do for you?
Have you ever been new to a project and dont know where to start?

Maybe you are a seasoned veteran, go on vacation and come back to find you've forgotten what bugs you were working on?

Or maybe you just like writing down and being able to keep track of your bugs

If so, bedbugs is for you!!!

## Screenshots
#### Landing Page:
![Landing Page](./src/images/LandingPage.PNG)

#### Applications Summary:
##### Get a List of all Applications and how many Bugs are either Open, In-Progress, or Closed that asre associated with this Application.
Need to update your application?  Click on the Application Name and begin updating.  Be aware, Applications with open bugs cannot be deleted.

![Applications Summary](./src/images/ApplicationsPage.PNG)

#### Bugs Summary:
##### Get a List of all the Bugs along with their Ticket Number, Application, Priority, Status, and Who Reported the Bug
Need to update your bug?  Add some developer notes?  Click on the Bug Name and begin updating.

![Bugs Summary](./src/images/BugsPage.PNG)


## bedbugs API

The API allows you to GET, PATCH, DELETE, and POST an application and bug.

### Endpoints
**/api/applications**

Get an object array of the Applications in the database

**/api/applications/:application_id**

Get a specifc Application object

**/api/bugs**

Get an object array of the Bugs in the database

**/api/bugs/:bug_id**

Get a specific Bug object

**/api/auth/login**

Authenticate Login

**/api/auth/refresh**

Authenticate Refresh

**/api/users**

Register User

## Source Code
bedbugs Client: [https://github.com/cableredi/bedbugs-client](https://github.com/cableredi/bedbugs-client)

bedbugs API: [https://github.com/cableredi/bedbugs-api](https://github.com/cableredi/bedbugs-api)



## Technology Used
HTML5, SCSS/CSS, Node.js, React, Express, PostgreSQL