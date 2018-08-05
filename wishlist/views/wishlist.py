from django.http import JsonResponse
from wishlist.models import Wishlist, WishlistItem
from django.forms.models import model_to_dict

def lists(request):
    return JsonResponse({"results": list(Wishlist.objects.all().values())})

def detail(request, wishlist_id):
    results = []
    try: 
        wishlist = Wishlist.objects.get(id=wishlist_id)
        results = list(wishlist.wishlistitem_set.all().values())
    except Wishlist.DoesNotExist:
        pass

    return JsonResponse({"details": model_to_dict(wishlist), "results": results})

def update(request, wishlist_id):
    pass

def delete(request, wishlist_id):
    try: 
        wishlist = Wishlist.objects.get(id=wishlist_id)
        wishlist.delete()
    except Wishlist.DoesNotExist:
        pass
    return JsonResponse({})

def add_item(request, wishlist_id):
    pass

def update_item(request, wishlist_id):
    pass

def delete_item(request, item_id):
    try: 
        item = WishlistItem.objects.get(id=item_id)
        item.delete()
    except WishlistItem.DoesNotExist:
        pass
    return JsonResponse({})