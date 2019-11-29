from django.shortcuts import render, redirect
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404

from django.contrib import messages

from .models import Books
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import booksSerializer, rateReviewSerializer
from django.db.models import Q
from django.contrib.auth import get_user_model


@api_view(['POST'])
def share_books(request):
    # if request.user.is_authenticated:
    data = request.data

    current_user = request.user.id
    # print(current_user)
    data['owner'] = current_user
    serializer = booksSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def rateReviewbooks(request,pk):
    # if request.user.is_authenticated:
    data = request.data

    current_user = request.user.id
    data['rate_reviewer'] = current_user

    serializer = rateReviewSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BookDetailView(APIView):
    def get(self,request, pk):
        try:
            results = Books.objects.get(pk=pk)
        except Books.DoesNotExist:
            return Response("Doesn't exist")

        serializer = booksSerializer(results)
        return Response(serializer.data)


class booksList(APIView):
    def get(self, request):

        # if request.user.is_authenticated:
            query = self.request.GET.get('q','')

            if query:
                results = Books.objects.filter(Q(title__icontains=query) | Q(author__icontains=query) | Q(category__icontains=query))
                serializer = booksSerializer(results, many=True)
                return Response(serializer.data)

            else:
                allBooks = Books.objects.all()
                serializer = booksSerializer(allBooks, many=True)
                return Response(serializer.data)


class BookShareHistory(APIView):
    def get(self, request):

        # if request.user.is_authenticated:

        current_user = request.user.id
        userBooks = Books.objects.filter(owner=current_user)

        results = userBooks.filter(type='share')
        serializer = booksSerializer(results, many=True)
        return Response(serializer.data)

class BookSellHistory(APIView):
    def get(self, request):

        # if request.user.is_authenticated:

        current_user = request.user.id
        userBooks = Books.objects.filter(owner=current_user)

        results = userBooks.filter(type='sell')
        serializer = booksSerializer(results, many=True)
        return Response(serializer.data)