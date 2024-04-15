from django.contrib.auth.models import User
from django.test import TestCase

from .models import Folder, File


class FileSystemEntityTest(TestCase):
    """Test case for creating and managing file system entities."""

    def setUp(self):
        """Sets up test data before each test."""
        self.user = User.objects.create_user(username='test_user', email='test@example.com',
                                             password='not_a_real_password')
        self.folder = Folder.objects.create(name='My Videos', type='folder', user=self.user)
        self.file = File.objects.create(
            name='charlie_bit_my_finger.mp4',
            type='file',
            extension='mp4',
            size=1024,  # Add a valid size value
            url='https://www.youtube.com/watch?v=0EqSXDwTq6U&ab_channel=jasminmakeup',
            parent=self.folder,
            user=self.user,  # Assign the user to the file
        )

        print('Test data set up')

    def test_create_entities(self):
        """Tests creating a user, folder, and file."""
        self.assertEqual(self.user.username, 'test_user')
        self.assertEqual(self.folder.name, 'My Videos')
        self.assertEqual(self.folder.user, self.user)
        self.assertEqual(self.file.name, 'charlie_bit_my_finger.mp4')
        self.assertEqual(self.file.extension, 'mp4')
        self.assertEqual(self.file.url, 'https://www.youtube.com/watch?v=0EqSXDwTq6U&ab_channel=jasminmakeup')
        self.assertEqual(self.file.parent, self.folder)

