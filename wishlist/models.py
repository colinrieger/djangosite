from django.contrib.auth.models import User
from django.db import models

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=64)

    def __str__(self):
        return self.name
    
class WishlistItem(models.Model):
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE)
    name = models.CharField(max_length=64)
    url = models.TextField()

    def __str__(self):
        return self.name