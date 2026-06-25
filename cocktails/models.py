# -*- coding: utf-8 -*-
from django.db import models

FLAVORS = [
    ("Сладкий", "Сладкий"), ("Кислый", "Кислый"), ("Горький", "Горький"),
    ("Острый", "Острый"), ("Игристый", "Игристый"),
]


class Drink(models.Model):
    number = models.PositiveIntegerField("Номер", unique=True)
    name_ru = models.CharField("Название (RU)", max_length=80)
    name_en = models.CharField("Название (EN)", max_length=80)
    flavor = models.CharField("Вкус", max_length=20, choices=FLAVORS)
    tag2 = models.CharField("Тег 2", max_length=30, blank=True)
    tag3 = models.CharField("Тег 3", max_length=30, blank=True)

    adelhyde = models.PositiveSmallIntegerField("Adelhyde", default=0)
    bronson = models.PositiveSmallIntegerField("Bronson", default=0)
    flanergide = models.PositiveSmallIntegerField("Flanergide", default=0)
    delta = models.PositiveSmallIntegerField("Pwd Delta", default=0)
    karmotrine = models.PositiveSmallIntegerField("Karmotrine", default=0)
    opt_karmotrine = models.BooleanField("Karmotrine опционально", default=False)

    based_on = models.CharField("На основе (классика)", max_length=80, blank=True)
    recipe = models.TextField("Рецепт", help_text="По одному ингредиенту в строке.")
    method = models.TextField("Способ приготовления")
    note = models.TextField("Заметка о вкусе", blank=True)
    dossier = models.TextField("Досье / история", blank=True)
    bonus = models.BooleanField("Внештатная стойка", default=False,
                                help_text="Отметь, если напиток не из канона бара.")

    class Meta:
        ordering = ["number"]
        verbose_name = "Коктейль"
        verbose_name_plural = "Коктейли"

    def __str__(self):
        return "%02d · %s" % (self.number, self.name_ru)

    def as_dict(self):
        tags = [self.flavor] + [t for t in (self.tag2, self.tag3) if t]
        return {
            "n": self.number, "ru": self.name_ru, "en": self.name_en, "tags": tags,
            "mix": {"A": self.adelhyde, "B": self.bronson, "F": self.flanergide,
                    "D": self.delta, "K": self.karmotrine},
            "opt": self.opt_karmotrine, "based": self.based_on,
            "recipe": [l for l in self.recipe.splitlines() if l.strip()],
            "method": self.method, "note": self.note,
            "dossier": self.dossier, "bonus": self.bonus,
        }


class Bottled(models.Model):
    name_ru = models.CharField("Название (RU)", max_length=80)
    name_en = models.CharField("Название (EN)", max_length=80)
    description = models.TextField("Описание")
    order = models.PositiveSmallIntegerField("Порядок", default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Бутылочный напиток"
        verbose_name_plural = "Бутылочные напитки"

    def __str__(self):
        return self.name_ru

    def as_dict(self):
        return {"ru": self.name_ru, "en": self.name_en, "desc": self.description}


class NewsItem(models.Model):
    text = models.CharField("Текст новости", max_length=200)
    active = models.BooleanField("Показывать в строке", default=True)
    order = models.PositiveSmallIntegerField("Порядок", default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Новость (бегущая строка)"
        verbose_name_plural = "Новости (бегущая строка)"

    def __str__(self):
        return self.text
