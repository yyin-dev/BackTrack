# BackTrack
The group project for HKU COMP 3297 _Sortware Engineering_, 2019 -- group F (FastDev).
## Installation
You need to have environment for python and Django first.     

*   **For Backend**  
    cd backend  
    python -m venv env  
    source env/bin/activate  
    pip install django djangorestframework   django-cors-headers  
    cd backtrack  
    python manage.py runserver  

*   **For Frontend**  
    cd frontend/ui  
    yarn install  
    yarn add antd --save  
    yarn add axios --save  
    yarn start  

## User Initialization
*   **For importing initial user data**  
    cd backend  
    python -m venv env  
    source env/bin/activate  
    python manage.py flush  
    python manage.py loaddata init_user_data  
*   Superuser for backend:   
    username: admin  
    password: test  
*   All users for _BackTrack_:   

| Username | Password | Role |
| :-------------: |:-------------:| :-----:|
| Dev1 | 11111111 | Product Owner |
| Dev2 | 11111111 | Product Owner |
| Dev3 | 11111111 | Developer |
| Dev4 | 11111111 | Developer |
| Dev5 | 11111111 | Developer |
| Dev6 | 11111111 | Developer |
| Dev7 | 11111111 | Developer |
| Dev8 | 11111111 | Developer |
| SM1 | 11111111 | Scrum Master |

## Limitations of our final executable
* Insufficient test
* PBI priority changing only allowed for switching PBIs of two adjacent rows
* System not real-time and synchronized for different users