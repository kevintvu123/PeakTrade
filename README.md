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