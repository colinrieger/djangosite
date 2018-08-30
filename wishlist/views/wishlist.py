from django.http import JsonResponse
from wishlist.models import Wishlist, WishlistItem
from django.forms.models import model_to_dict
import json

def wishlists(request):
    results = Wishlist.objects.filter(user=request.user)

    wishlists = list(results.values())
    for wishlist, result in zip(wishlists, results):
        wishlist['items'] = list(result.wishlistitem_set.all().values())

    context = {
        'wishlists': wishlists
    }

    return JsonResponse(context)

def add(request):
    json_request = json.loads(request.body.decode('utf-8'))

    result = Wishlist(
        user = request.user,
        name = json_request['name']
    )
    result.save()

    wishlist = model_to_dict(result)
    wishlist['items'] = []

    context = {
        'wishlist': wishlist
    }

    return JsonResponse(context)

def update(request, wishlist_id):
    try:
        json_request = json.loads(request.body.decode('utf-8'))

        result = Wishlist.objects.get(id=wishlist_id)
        result.name = json_request['name']
        result.save()

        wishlist = model_to_dict(result)
        wishlist['items'] = list(result.wishlistitem_set.all().values())

        context = {
            'wishlist': wishlist
        }

        return JsonResponse(context)
    except Wishlist.DoesNotExist:
        pass

    return JsonResponse({})

def delete(request, wishlist_id):
    try: 
        wishlist = Wishlist.objects.get(id=wishlist_id)
        wishlist.delete()
    except Wishlist.DoesNotExist:
        pass

    return JsonResponse({})

def add_item(request, wishlist_id):
    try:
        json_request = json.loads(request.body.decode('utf-8'))

        result = Wishlist.objects.get(id=wishlist_id)
        result.wishlistitem_set.create(
            name = json_request['name'],
            url = json_request['url']
        )

        wishlist = model_to_dict(result)
        wishlist['items'] = list(result.wishlistitem_set.all().values())

        context = {
            'wishlist': wishlist
        }

        return JsonResponse(context)
    except Wishlist.DoesNotExist:
        pass

    return JsonResponse({})

def update_item(request, item_id):
    try:
        json_request = json.loads(request.body.decode('utf-8'))

        item = WishlistItem.objects.get(id=item_id)
        result = item.wishlist
        item.name = json_request['name']
        item.url = json_request['url']
        item.save()

        wishlist = model_to_dict(result)
        wishlist['items'] = list(result.wishlistitem_set.all().values())

        context = {
            'wishlist': wishlist
        }

        return JsonResponse(context)
    except WishlistItem.DoesNotExist:
        pass

    return JsonResponse({})

def delete_item(request, item_id):
    try: 
        item = WishlistItem.objects.get(id=item_id)
        result = item.wishlist
        item.delete()

        wishlist = model_to_dict(result)
        wishlist['items'] = list(result.wishlistitem_set.all().values())

        context = {
            'wishlist': wishlist
        }

        return JsonResponse(context)
    except WishlistItem.DoesNotExist:
        pass

    return JsonResponse({})