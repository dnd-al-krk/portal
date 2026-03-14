from ..serializers import RegisterProfileSerializer, RegisterUserSerializer


class TestRegistrationSerializer:
    def test_registration_data(self):
        data = {
            "user": {
                "first_name": "Testing",
                "last_name": "Registration",
                "password": "qwer4321",
                "email": "user@email.com",
            },
            "nickname": "SomeUser123",
        }

        serializer = RegisterProfileSerializer(data=data)

        assert serializer.is_valid()

    def test_bad_email(self):
        data = {
            "user": {
                "first_name": "Testing",
                "last_name": "Registration",
                "password": "qwer4321",
                "email": "useremail.com",
            },
            "nickname": "SomeUser123",
        }

        serializer = RegisterProfileSerializer(data=data)

        assert not serializer.is_valid()

    def test_empty_email(self):
        data = {
            "user": {"first_name": "Testing", "last_name": "Registration", "password": "qwer4321", "email": ""},
            "nickname": "SomeUser123",
        }

        serializer = RegisterProfileSerializer(data=data)

        assert not serializer.is_valid()

    def test_empty_first_name(self):
        data = {
            "user": {"first_name": "", "last_name": "Registration", "password": "qwer4321", "email": "email@email.com"},
            "nickname": "SomeUser123",
        }

        serializer = RegisterProfileSerializer(data=data)

        assert not serializer.is_valid()

    def test_empty_last_name(self):
        data = {
            "user": {"first_name": "Some", "last_name": "", "password": "qwer4321", "email": "email@email.com"},
            "nickname": "SomeUser123",
        }

        serializer = RegisterProfileSerializer(data=data)

        assert not serializer.is_valid()

    def test_empty_password(self):
        data = {
            "user": {"first_name": "Some", "last_name": "Name", "password": "", "email": "email@email.com"},
            "nickname": "SomeUser123",
        }

        serializer = RegisterProfileSerializer(data=data)

        assert not serializer.is_valid()

    def test_empty_nickname(self):
        data = {
            "user": {
                "first_name": "Some",
                "last_name": "Last Name",
                "password": "qwer4321",
                "email": "email@email.com",
            },
            "nickname": "",
        }

        serializer = RegisterProfileSerializer(data=data)

        assert serializer.is_valid()


class TestRegistrationUserSerializer:
    def test_password_length_check(self):

        data = {"first_name": "Some", "last_name": "Person", "password": "short", "email": "some@email.com"}

        serializer = RegisterUserSerializer(data=data)

        assert not serializer.is_valid()
