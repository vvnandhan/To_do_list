from django.shortcuts import render
from django.http import JsonResponse
from .models import Task
import json

def index(request):
    return render(request, 'todo/index.html')

def task_list(request):
    tasks = Task.objects.all().values()
    return JsonResponse(list(tasks), safe=False)

def add_task(request):
    data = json.loads(request.body)
    task = Task.objects.create(title=data['title'])
    return JsonResponse({'id': task.id, 'title': task.title, 'completed': task.completed})

def update_task(request, task_id):
    data = json.loads(request.body)
    task = Task.objects.get(id=task_id)
    task.completed = data.get('completed', task.completed)
    task.title = data.get('title', task.title)
    task.save()
    return JsonResponse({'status': 'updated'})

def delete_task(request, task_id):
    Task.objects.get(id=task_id).delete()
    return JsonResponse({'status': 'deleted'})

def clear_all(request):
    Task.objects.all().delete()
    return JsonResponse({'status': 'cleared'})
