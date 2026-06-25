# -*- coding: utf-8 -*-
import json
from django.shortcuts import render
from .models import Drink, Bottled, NewsItem


def index(request):
    drinks = [d.as_dict() for d in Drink.objects.all()]
    bottled = [b.as_dict() for b in Bottled.objects.all()]
    news = [n.text for n in NewsItem.objects.filter(active=True)]
    ctx = {
        "drinks_json": json.dumps(drinks, ensure_ascii=False),
        "bottled_json": json.dumps(bottled, ensure_ascii=False),
        "news_json": json.dumps(news, ensure_ascii=False),
    }
    return render(request, "index.html", ctx)
