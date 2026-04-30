# Talkify

Talkify is a full-stack real-time chat application built using Django, Django REST Framework, React (Vite), and WebSockets.

## Features

* User registration and login (JWT authentication)
* Create and join chat rooms
* Real-time messaging using WebSockets
* REST API with Django REST Framework
* Responsive frontend with React

## Tech Stack

Backend:

* Django
* Django REST Framework
* Simple JWT
* Django Channels
* MySQL

Frontend:

* React (Vite)
* Axios
* React Router

## Project Structure

talkify_backend/

* talkify (project settings)
* auth (authentication)
* rooms (room management)
* chat (real-time messaging)

talkify_frontend/

* src (React app)

## Setup

### Backend

cd talkify_backend
python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate
python manage.py runserver

### Frontend

cd talkify_frontend

npm install
npm run dev

## Author

Aghosh PR

