# BackTrack
The group project for HKU COMP 3297 _Sortware Engineering_, 2019 -- Group F (FastDev).

## Installation
You need to have environment for python, Django, and ReactJS first.     

*   **For Backend**  
    ```
    cd backend  
    python -m venv env  
    source env/bin/activate  
    pip install django djangorestframework django-cors-headers  
    cd backtrack  
    python manage.py runserver  
    ```

*   **For Frontend**  
    ```
    cd frontend/ui  
    yarn install  
    yarn add antd --save  
    yarn add axios --save  
    yarn start  
    ```

## User Initialization
We provide utility for conveniently initializing data for users, for testing.  

*   **For importing initial user data**  
    ```
    cd backend  
    python -m venv env  
    source env/bin/activate  
    cd backtrack  
    python manage.py flush  
    python manage.py loaddata init_user_data  
    ```
*   Superuser for backend:  
    username: admin  
    password: test  

*   Initialized user data:   

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

## Run Unit Test
Simple test cases for models are offered (not included tests for views).

```
cd backend  
python -m venv env  
source env/bin/activate  
cd backtrack  
python manage.py test  
```

## Limitations of our final executable
* Insufficient test
* PBI priority changing only allowed for switching PBIs of two adjacent rows  
* PO cannot self-define max capacity for the first sprint of a project (forced to be 10 by default). He can only custom max capacity for the subsequent sprints  
* System not real-time and synchronized for different users
* Data fetching/querying could be further reduced