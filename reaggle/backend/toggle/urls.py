from django.conf.urls import url, include
from django.contrib import admin

urlpatterns = [
    url(r'^api/', include('entry.urls')),
    url(r'^admin/', admin.site.urls),
]
