from django.db import models

#class Account(models.Model):
#    name = models.CharField(max_length=64)
    
class Wishlist(models.Model):
    #account = models.ForeignKey(Account, on_delete=models.CASCADE)
    name = models.CharField(max_length=64)

    def __str__(self):
        return self.name
    
class WishlistItem(models.Model):
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE)
    name = models.CharField(max_length=64)
    url = models.TextField()

    def __str__(self):
        return self.name