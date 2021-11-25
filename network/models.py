from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    def serialize(self):
        return {"id": self.pk, "username": self.username, "email": self.email}


class Post(models.Model):
    author = models.ForeignKey(User, related_name="_author", on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    body = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name="_likes", blank=True)

    def get_likes(self):
        return self.likes.count()

    def serialize(self):
        return {
            "id": self.pk,
            "author": self.author.username,
            "title": self.title,
            "body": self.body,
            "date-created": self.date_created.strftime("%B %d, %Y"),
            "likes": [user.serialize() for user in self.likes.all()],
            "likes_count": self.likes.count(),
        }


class Follow(models.Model):
    user = models.ForeignKey(User, related_name="_user", on_delete=models.CASCADE)
    following = models.ForeignKey(
        User, related_name="_following", on_delete=models.CASCADE
    )


    def serialize(self):

        return {
            "id": self.pk,
            "user": self.user.serialize(),
            "following": self.following.serialize()
        }