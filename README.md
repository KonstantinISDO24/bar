# VA-11 HALL-A — B.T.C (Django)

Интерактивный браузер рецептов в стилистике игры VA-11 HALL-A. Рецепты, бутылочные
напитки и новости в бегущей строке хранятся в БД и редактируются через стандартную
админку Django по адресу `/admin`.

## Запуск локально

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed             # загрузить 34 коктейля, бутылочные и новости
python manage.py createsuperuser  # создать логин для /admin
python manage.py runserver
```

Сайт: http://127.0.0.1:8000/ — админка: http://127.0.0.1:8000/admin/

## Добавить напиток
Зайди на `/admin` → «Коктейли» → «Добавить». Поля «Микс BTC» — это количества
ингредиентов (0–10). «Рецепт» — по одному ингредиенту в строке. После сохранения
напиток сразу появится на главной.

## Деплой на Render (Web Service, не Static Site!)
- Build Command: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate && python manage.py seed`
- Start Command: `gunicorn barproject.wsgi:application`
- Env: `DEBUG=False`, `SECRET_KEY=<свой>`, `ALLOWED_HOSTS=<имя>.onrender.com`
- Суперпользователя создать через Render → Shell: `python manage.py createsuperuser`
