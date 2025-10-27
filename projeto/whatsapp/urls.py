from django.urls import path
from . import views

urlpatterns = [
    path('send/', views.send_whatsapp_message, name='send_whatsapp'),
    path('notify/new-product/', views.notify_new_product, name='notify_new_product'),
    path('notify/low-stock/', views.notify_low_stock, name='notify_low_stock'),
    path('notify/user-created/', views.notify_user_created, name='notify_user_created'),
]
