# BackTrack
This is the group project for HKU COMP 3297 <em>Sortware Engineering</em>, 2019 -- group F (FastDev).
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

## Limitations of our final executable
* Insufficient test
* PBI priority changing only allowed for continuous PBI
* System not real-time and synchronized for different users