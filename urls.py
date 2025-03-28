from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('tasks/', views.task_list, name='task_list'),
    path('tasks/add/', views.add_task, name='add_task'),
    path('tasks/update/<int:task_id>/', views.update_task, name='update_task'),
    path('tasks/delete/<int:task_id>/', views.delete_task, name='delete_task'),
    path('tasks/clear/', views.clear_all, name='clear_all'),
]
