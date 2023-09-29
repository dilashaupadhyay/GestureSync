from django.shortcuts import render, redirect
import os
from django.conf import settings


# Create your views here.
def index(request):
    return render(request, 'build/index.html')


def CreateKeyword(request):
    DATA_PATH = os.path.join('MP_DATA')

    no_of_sequences = 30
    sequence_length = 30
    start_folder = 30

    if request.method == "POST":
        keyword = request.POST.get('keyword')
        
        for sequence in range(1, no_of_sequences+1):
            try:
                os.makedirs(os.path.join(DATA_PATH, keyword, str(sequence)))
            except:
                pass