import uuid
from locust import HttpUser, SequentialTaskSet, task, between
import random

class UserBehavior(SequentialTaskSet):
    def on_start(self):
        unique_id = uuid.uuid4().hex[:6]
        
        response = self.client.post("/auth/signup", json={
            "name": f"user_{unique_id}",
            "password": "password123"
        })

        if response.status_code != 200:
            print(f"Signup failed for {unique_id}: {response.text}")

    @task
    def get_me(self):
        self.client.get("/auth/me")

    @task
    def fetch_topics(self):
        self.client.get("/topic/fetch")

    @task
    def fetch_post(self):
        self.client.get("/post/fetch1/25")

    
    @task
    def create_comment(self):
        unique_id = uuid.uuid4().hex[:6]
        
        self.client.post("/comment/create", json={
            "comment": f"Testing real-time flood! {unique_id}",
            "postID": 25
        })

    @task
    def react_to_post(self):
        self.client.post("/post/react/25", json={
            "reaction": random.randint(0,1)*2-1
        })


class ForumUser(HttpUser):
    wait_time = between(1, 2)
    host = "http://localhost:5000"
    tasks = [UserBehavior]
