# import json
# import csv
# from django.contrib.auth.decorators import login_required
# from django.db import DatabaseError, transaction
# from django.forms.models import model_to_dict
# from django.http import HttpResponse
# from django.shortcuts import render
# from rest_framework import status
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response
#
# from .models import *
# from .models.Item.ItemModels import Item
# from .serializers import *
# from .views_utils import manage_items_change
#
#
# Create your views here.
# @login_required(login_url="/r'^login/$'")
# def inventory_index(request):
#     return render(request, "inventory_index.html")
#
#
# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def api_items(request):
#     try:
#         items_data = ItemSerializer(Item.objects.all(), many=True).data
#         return Response(items_data, status=status.HTTP_200_OK)
#     except Exception as e:
#         return Response(
#             {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
#         )
#
