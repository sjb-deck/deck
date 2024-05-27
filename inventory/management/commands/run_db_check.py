from django.core.management.base import BaseCommand
from inventory.items.routines.routine import run_routine as items_routine
from inventory.kits.routines.routine import run_routine as kits_routine
import json


class Command(BaseCommand):
    help = "Checks integrity of items and orders"

    def add_arguments(self, parser):
        parser.add_argument("routine", nargs="?", default="all")

    def handle(self, *args, **options):
        routine = options["routine"]
        log = {}

        self.stdout.write(self.style.HTTP_INFO(f"Running routine: {routine}"))

        if routine in ("items", "all"):
            log["items"] = items_routine()

        if routine in ("kits", "all"):
            log["kits"] = kits_routine()

        self.stdout.write(self.style.SUCCESS("Routine completed."))

        if log:
            log_json = json.dumps(log, indent=4)
            self.stdout.write(log_json)

            with open("routine_log.json", "w") as f:
                f.write(log_json)
