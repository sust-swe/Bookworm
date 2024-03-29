from django.db import models
from django.contrib.auth import get_user_model

UserModel = get_user_model()


# Create your models here.
class Books(models.Model):
    """docstring for Books"""

    title = models.CharField(max_length=50)
    author = models.CharField(max_length=50)
    isbn = models.CharField(max_length=50, default='1E1E')
    thumbnail = models.CharField(max_length=150, default='https://SOME STRING')
    category = models.CharField(max_length=50, default='Others')
    availability = models.BooleanField(default=True)
    description = models.CharField(max_length=500, default='')
    price = models.IntegerField(default=0)
    # owner = models.CharField(max_length=100, default='')
    owner = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='book_owner')
    type = models.CharField(max_length=50, default='share')
    owner_email = models.EmailField(max_length=100,default='abc@gmail.com')


    def __str__(self):
        return self.title;

    class Meta:
        db_table = "books"

class RateReview(models.Model):
    books_rr = models.ForeignKey(Books, related_name='reviews', on_delete=models.CASCADE, default=None)
    ratings = models.IntegerField(default=5)
    review = models.TextField()
    rate_reviewer = models.CharField(max_length=50, default='1')
    book = models.CharField(max_length=50, default='1')

    def __str__(self):
        return self.ratings;

    class Meta:
        db_table = "ratings_reviews"
