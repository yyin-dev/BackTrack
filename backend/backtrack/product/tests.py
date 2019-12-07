from django.test import TestCase
import datetime

from product.models import PBI, Project, Sprint
from sprint.models import Task
from user.models import User


class ModalTest(TestCase):
    def setUp(self):
        Project.objects.create(
            name="Project1",
            description="Description of Project1",
            # started is false as default
        )

        Sprint.objects.create(
            project=Project.objects.get(name="Project1")
        )

        PBI.objects.create(
            title="P1",
            detail="N/A",
            story_point=1,
            project=None,
            # Default values
            status="To Do",
            start_date="2019-12-07",
            priority=0)

        Task.objects.create(
            name="T1",
            description="N/A",
            pbi=PBI.objects.get(title="P1"),
            status="To Do",
            estimated_time=0,
            pic="FastDev")
        
        User.objects.create(
            username = "U1",
            role = "Scrum Master"
        )

    def test_project(self):
        project = Project.objects.get(name="Project1")
        self.assertEqual(project.description, "Description of Project1")
        self.assertEqual(project.started, False)

    def test_pbi(self):
        pbi = PBI.objects.get(title="P1")
        self.assertEqual(pbi.detail, "N/A")
        self.assertEqual(pbi.story_point, 1)
        self.assertEqual(pbi.project, None)
        self.assertEqual(pbi.status, "To Do")
        self.assertEqual(pbi.start_date, datetime.date(2019, 12, 7))
        self.assertEqual(pbi.priority, 0)

    def test_task(self):
        task = Task.objects.get(name="T1")
        self.assertEqual(task.description, "N/A")
        self.assertEqual(task.status, "To Do")
        self.assertEqual(task.estimated_time, 0)
        self.assertEqual(task.pic, "FastDev")
    
    def test_user(self):
        user = User.objects.get(username="U1")
        self.assertEqual(user.role, "Scrum Master")