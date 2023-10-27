from django.contrib import admin
from inventory.items.models import *
from inventory.kits.models import *

# Register your models here.
admin.site.register(Item)
admin.site.register(ItemExpiry)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(LoanOrder)
admin.site.register(Kit)
admin.site.register(Blueprint)
admin.site.register(History)
