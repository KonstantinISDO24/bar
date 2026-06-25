# -*- coding: utf-8 -*-
from django.contrib import admin
from .models import Drink, Bottled, NewsItem

admin.site.site_header = "B.T.C — управление баром VA-11 HALL-A"
admin.site.site_title = "B.T.C admin"
admin.site.index_title = "Содержимое бара"


@admin.register(Drink)
class DrinkAdmin(admin.ModelAdmin):
    list_display = ("number", "name_ru", "name_en", "flavor", "bonus")
    list_filter = ("flavor", "bonus")
    search_fields = ("name_ru", "name_en", "based_on")
    ordering = ("number",)
    fieldsets = (
        (None, {"fields": ("number", ("name_ru", "name_en"), ("flavor", "tag2", "tag3"), "bonus")}),
        ("Микс BTC", {"fields": (("adelhyde", "bronson", "flanergide", "delta", "karmotrine"),
                                 "opt_karmotrine")}),
        ("Рецепт", {"fields": ("based_on", "recipe", "method", "note", "dossier")}),
    )


@admin.register(Bottled)
class BottledAdmin(admin.ModelAdmin):
    list_display = ("name_ru", "name_en", "order")
    list_editable = ("order",)
    search_fields = ("name_ru", "name_en")


@admin.register(NewsItem)
class NewsItemAdmin(admin.ModelAdmin):
    list_display = ("text", "active", "order")
    list_editable = ("active", "order")
