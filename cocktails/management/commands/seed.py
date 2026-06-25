# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand
from cocktails.models import Drink, Bottled, NewsItem
from cocktails.seed_data import DRINKS, BOTTLED, NEWS


class Command(BaseCommand):
    help = "Заполняет базу коктейлями, бутылочными напитками и новостями (идемпотентно)."

    def handle(self, *args, **opts):
        for d in DRINKS:
            number = d["number"]
            defaults = {k: v for k, v in d.items() if k != "number"}
            Drink.objects.update_or_create(number=number, defaults=defaults)
        for i, b in enumerate(BOTTLED):
            Bottled.objects.update_or_create(name_en=b["name_en"],
                                             defaults={**b, "order": i})
        for i, t in enumerate(NEWS):
            NewsItem.objects.update_or_create(text=t, defaults={"active": True, "order": i})
        self.stdout.write(self.style.SUCCESS(
            "Готово: %d коктейлей, %d бутылочных, %d новостей." % (len(DRINKS), len(BOTTLED), len(NEWS))))
