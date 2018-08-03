from django.urls import path

from .views import *

urlpatterns = [
    path('', index.index, name='index'),
    path('lists/', wishlist.lists, name='lists'),
    path('<int:wishlist_id>/', wishlist.detail, name='detail'),
    path('<int:wishlist_id>/update', wishlist.update, name='update'),
    path('<int:wishlist_id>/delete', wishlist.delete, name='delete'),
    path('<int:wishlist_id>/add_item', wishlist.add_item, name='add_item'),
    path('<int:item_id>/update_item', wishlist.update_item, name='update_item'),
    path('<int:item_id>/delete_item', wishlist.delete_item, name='delete_item'),
]