# Generated by Django 4.1.13 on 2024-08-31 20:11

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('files', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SharedItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('shared_at', models.DateTimeField(auto_now_add=True)),
                ('file_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='shares',
                                                to='files.file')),
                ('shared_with',
                 models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='shared_items',
                                   to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('file_item', 'shared_with')},
            },
        ),
    ]
