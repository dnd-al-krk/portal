import json

import pytest
from rest_framework.test import APIClient


class TestRegistrationView:
    @pytest.mark.django_db
    def test_registration_done(self):
        client = APIClient()
        data = {
            "user": {
                "first_name": "Testing",
                "last_name": "Registration",
                "password": "qwer4321",
                "email": "user@email.com",
            },
            "nickname": "SomeUser123",
        }

        response = client.post("/api/register/", data, format="json")

        assert response.status_code == 201
