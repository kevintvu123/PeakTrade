# PeakTrade

<a href='https://peaktrade.onrender.com/' alt=''>PeakTrade</a> is a clone of the popular investing application, Robinhood, that allows users to purchase and sell shares of stocks. PeakTrade also implements a group functionality that allows for friendly competition among all users and groups of friends.

## ✅ Wiki Link

- [Database Schema](https://github.com/kevintvu123/PeakTrade/wiki/DB-Schema)
- [Feature List](https://github.com/kevintvu123/PeakTrade/wiki/Features-List)
- [User Stories](https://github.com/kevintvu123/PeakTrade/wiki/User-Stories)

## 👩‍💻 Tech Stack

**Frameworks, Platforms and Libraries:**

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Flask](https://img.shields.io/badge/Flask-%23404d59.svg?style=for-the-badge&logo=flask&logoColor=%2361DAFB) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![Redux](https://img.shields.io/badge/python-yellow?style=for-the-badge&logo=python&logoColor=blue)

**Database:**

![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

**Hosting:**

![Render](https://img.shields.io/badge/Render-informational?style=for-the-badge&logo=render&logoColor=%5bdec3)

## 💻 Run Locally

Clone the project

```bash
  git clone https://github.com/kevintvu123/PeakTrade
```

Install dependencies

Backend

```bash
pip install -r requirements.txt &&
flask db upgrade &&
flask seed all
```

Frontend

```bash
cd react-app
npm install
```

Start the server

```bash
pipenv run flask run
```

In seperate terminal

```bash
cd react-app
npm start
```

## 🖥 Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```
SECRET_KEY=lkasjdf09ajsdkfljalsiorj12n3490re9485309irefvn,u90818734902139489230
DATABASE_URL=sqlite:///dev.db
SCHEMA=flask_schema
```

## Landing Page
Users can access the "Log In" and "Sign Up" buttons on the top right of the landing page.

<img width="1920" alt="landing" src="https://cdn.discordapp.com/attachments/1039657765427224709/1061824626294009866/image.png">

## Log In and Sign Up
Users can redirect back and forth from the log in and sign up pages. Users successfully logged in will be directed to their portfolio page where they can view their portfolio value, portfolio chart, owned stocks list, and groups. 

<img width="1920" alt="login" src="https://cdn.discordapp.com/attachments/1039657765427224709/1061824683680477184/image.png">

<img width="1920" alt="signup" src="https://cdn.discordapp.com/attachments/1039657765427224709/1061824732242124901/image.png">

<img width="1920" alt="portfolio" src="https://cdn.discordapp.com/attachments/1039657765427224709/1061824864366895204/image.png">

## Feature 1: Portfolio
Logged in users are able to access stock detail page by using the search bar and inputting either the stock ticker or stock name. On the detail page, users can buy and sell stocks. 

<img width="1920" alt="buy" src="https://cdn.discordapp.com/attachments/1039657765427224709/1061825031631544481/image.png">

<img width="1920" alt="sell" src="https://cdn.discordapp.com/attachments/1039657765427224709/1061825129493041284/image.png">

## Feature 2: Groups
Logged in users can create groups. Upon creation, group owners will be provided with an id. To invite friends, you would share the name of group and id. Users in groups can click "Show More" to display the other members and their buying power. Owners of a group can also rename and delete the group. Members of a group can choose to leave.

<img width="1920" alt="group creation" src="https://cdn.discordapp.com/attachments/1039657765427224709/1061825230097621062/image.png">

<img width="1920" alt="group deletion" src="https://cdn.discordapp.com/attachments/1039657765427224709/1061825311974633502/image.png">

## Future Implementations
* Stock Watchlist
* Stock News