# Django site with various apps
### Demos
Wishlist: [`https://djangosite.colinrieger.com/wishlist`](https://djangosite.colinrieger.com/wishlist)

### Setup
- Install Python 3/pip/venv/PostgreSQL.  
  ```
  sudo apt-get install python3 python3-pip python3-venv postgresql postgresql-contrib
  ```
- Create Database
  ```
  sudo su - postgres
  psql
  CREATE DATABASE djangosite_dev;
  ```
- Create Virtual Environment
  ```
  mkdir environments
  python3 -m venv environments/djangosite
  source environments/djangosite/bin/activate
  ```
- Update pip
  ```
  python -m pip install --upgrade pip
  ```
- Install Django/psycopg3/django-webpack-loader
  ```
  pip install django psycopg2-binary django-webpack-loader
  ```
- Clone Repository
  ```
  git clone https://github.com/colinrieger/djangosite.git
  cd djangosite
  ```
- Migrate Database
  ```
  python manage.py makemigrations
  python manage.py migrate
  ```
- Create Admin Account
  ```
  python manage.py createsuperuser
  ```
- Setup wishlistreact
  ```
  cd wishlistreact
  npm install
  ```
- Run Django Server
  ```
  cd <repo root path>
  python manage.py runserver 0:8000
  ```
- Run wishlistreact
  ```
  cd <repo root path>/wishlistreact
  BROWSER=none npm run start
  ```
  [http://localhost:8000/](http://localhost:8000/)
