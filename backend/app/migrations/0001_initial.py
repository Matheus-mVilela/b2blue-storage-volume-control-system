# Generated by Django 4.2.16 on 2024-11-12 02:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='BaseModel',
            fields=[
                (
                    'id',
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID',
                    ),
                ),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='RecyclingStorage',
            fields=[
                (
                    'basemodel_ptr',
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to='app.basemodel',
                    ),
                ),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(max_length=300)),
                ('capacity', models.FloatField(default=0.0)),
            ],
            bases=('app.basemodel',),
        ),
        migrations.CreateModel(
            name='StorageCleanupOrder',
            fields=[
                (
                    'basemodel_ptr',
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to='app.basemodel',
                    ),
                ),
                ('description', models.TextField(max_length=300, null=True)),
                ('current_capacity', models.FloatField()),
                ('approved_at', models.DateTimeField(null=True)),
                ('closed_at', models.DateTimeField(null=True)),
                (
                    'recycling_storage',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='cleanup_orders',
                        to='app.recyclingstorage',
                    ),
                ),
            ],
            bases=('app.basemodel',),
        ),
    ]
