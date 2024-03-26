from set_up import setup_django_env

setup_django_env()

import datetime
from django.contrib.auth.models import User
from inventory.items.models import Item, ItemExpiry, Order
from inventory.kits.models import Blueprint, Kit, History, LoanHistory
from inventory.kits.views_utils import compress_content
from constants import *


def add_log(log, model, level, model_id, message, log_type=None):
    data = {"model": model, "model_id": model_id, "type": log_type, "message": message}
    log[level].append(data)


def check_field_name(log, model, name, model_id, subject):
    if name is None:
        add_log(log, model, ERRORS, model_id, "{} is undefined".format(subject))
        return
    if name == "":
        add_log(log, model, ERRORS, model_id, "{} is empty".format(subject))
    if len(name) > 50:
        add_log(log, model, ERRORS, model_id, "{} is too long".format(subject))


def check_field_json(log, model, content, model_id, subject):
    if content is None:
        add_log(log, model, ERRORS, model_id, "{} is undefined".format(subject))
        return
    if not isinstance(content, (dict, list)):
        add_log(log, model, ERRORS, model_id, "{} is not a JSON".format(subject))


def check_field_date(log, model, date, model_id, subject):
    if date is None:
        add_log(log, model, ERRORS, model_id, "{} is undefined".format(subject))
        return
    if not isinstance(date, datetime.datetime):
        add_log(
            log,
            model,
            ERRORS,
            model_id,
            "{} is not a in datetime datatype".format(subject),
        )


def check_blueprint_field_archived(log, archived, blueprint_id):
    if archived is None:
        add_log(log, BLUEPRINT, ERRORS, blueprint_id, "Archived field is undefined")
        return
    if not isinstance(archived, bool):
        add_log(log, BLUEPRINT, ERRORS, blueprint_id, "Archived is not a boolean")


def check_blueprint_field_complete_content(log, complete_content, blueprint_id):
    if complete_content is None:
        add_log(log, BLUEPRINT, ERRORS, blueprint_id, "Complete content is undefined")
        return
    if not isinstance(complete_content, (dict, list)):
        add_log(
            log,
            BLUEPRINT,
            ERRORS,
            blueprint_id,
            "Complete content is not a json object",
        )


def check_item_id_quantity(log, item, blueprint_id):
    item_id = item["item_id"]
    item_quantity = item["quantity"]

    if item_quantity is None:
        add_log(
            log,
            BLUEPRINT,
            ERRORS,
            blueprint_id,
            "Item with id={} has an undefined quantity.".format(item_id),
        )
        return
    if item_id is None:
        add_log(log, BLUEPRINT, ERRORS, blueprint_id, "Item id is undefined")
        return

    if not Item.objects.filter(id=item_id).exists():
        add_log(
            log,
            BLUEPRINT,
            ERRORS,
            blueprint_id,
            "Item with id={} does not exist in the inventory.".format(item_id),
        )
    if not isinstance(item_quantity, int):
        add_log(
            log,
            BLUEPRINT,
            ERRORS,
            blueprint_id,
            "Item with id={} has a non-integer quantity.".format(item_id),
        )
    if item_quantity < 0:
        add_log(
            log,
            BLUEPRINT,
            ERRORS,
            blueprint_id,
            "Item with id={} has a negative quantity.".format(item_id),
        )
    if item_quantity == 0:
        add_log(
            log,
            BLUEPRINT,
            ERRORS,
            blueprint_id,
            "Item with id={} has a quantity of zero.".format(item_id),
        )


def check_kit_field_blueprint(log, blueprint, kit_id):
    if blueprint is None:
        add_log(log, KIT, ERRORS, kit_id, "Kit's blueprint is undefined")
        return
    if not Blueprint.objects.filter(id=blueprint.id).exists():
        add_log(
            log,
            KIT,
            ERRORS,
            kit_id,
            "Kit's blueprint with id={} does not exist.".format(blueprint.id),
        )
    if blueprint.archived:
        add_log(
            log,
            KIT,
            ERRORS,
            kit_id,
            "Kit's blueprint with id={} is archived.".format(blueprint.id),
        )


def check_kit_field_status(log, status, kit_id):
    if status is None:
        add_log(log, KIT, ERRORS, kit_id, "Kit's status is undefined")
        return
    if status not in KIT_STATUS:
        add_log(log, KIT, ERRORS, kit_id, "Kit's status is invalid")


def check_kit_history_match(log, kit):
    last_history = History.objects.filter(kit=kit).order_by("-date").first()
    if last_history is None:
        add_log(log, KIT, ERRORS, kit.id, "Kit has no history")
        return

    if last_history.snapshot != kit.content:
        add_log(
            log,
            KIT,
            ERRORS,
            kit.id,
            "Kit's content does not match last history snapshot",
        )

    if last_history.type == LOAN:
        last_loan_history = (
            LoanHistory.objects.filter(kit=kit).order_by("-date").first()
        )
        if kit.status != ON_LOAN and last_loan_history.return_date is None:
            add_log(
                log,
                KIT,
                ERRORS,
                kit.id,
                "Kit's {} status does not match last history of loan".format(
                    kit.status
                ),
            )
        if kit.status == ON_LOAN and last_loan_history.return_date is not None:
            add_log(
                log,
                KIT,
                ERRORS,
                kit.id,
                "Kit's {} status does not match last history of returned loan".format(
                    kit.status
                ),
            )

    if last_history.type == RETIREMENT and kit.status != RETIRED:
        add_log(
            log,
            KIT,
            ERRORS,
            kit.id,
            "Kit's {} status does not match last history of retirement".format(
                kit.status
            ),
        )


def check_kit_contents(log, kit):
    blueprint = Blueprint.objects.get(id=kit.blueprint.id)
    if blueprint is None:
        return

    for item_expiry in kit.content:
        if not ItemExpiry.objects.filter(id=item_expiry["item_expiry_id"]).exists():
            add_log(
                log,
                KIT,
                ERRORS,
                kit.id,
                "Kit contains item expiry with id={} does not exist in the inventory".format(
                    item_expiry["item_expiry_id"]
                ),
            )
        if item_expiry["quantity"] == 0:
            add_log(
                log,
                KIT,
                ERRORS,
                kit.id,
                "Kit contains item expiry with id={} that has a quantity of zero.".format(
                    item_expiry["item_expiry_id"]
                ),
            )
        if item_expiry["quantity"] < 0:
            add_log(
                log,
                KIT,
                ERRORS,
                kit.id,
                "Kit contains item expiry with id={} that has a negative quantity.".format(
                    item_expiry["item_expiry_id"]
                ),
            )

    kit_content = compress_content(kit.content)
    blueprint_item_ids = {item["item_id"] for item in blueprint.complete_content}

    if len(blueprint_item_ids) < len(kit_content):
        add_log(
            log,
            KIT,
            ERRORS,
            kit.id,
            "Kit contains more items than defined in its blueprint of id={}.".format(
                blueprint.id
            ),
        )

    for item in kit_content:
        if item["item_id"] not in blueprint_item_ids:
            add_log(
                log,
                KIT,
                ERRORS,
                kit.id,
                "Kit contains item with id={} that is not defined in its blueprint of id={}.".format(
                    item["item_id"], blueprint.id
                ),
            )


def check_history_field_kit(log, kit, kit_id):
    if kit is None:
        add_log(log, HISTORY, ERRORS, kit_id, "History's kit is undefined")
        return
    if not Kit.objects.filter(id=kit.id).exists():
        add_log(
            log,
            HISTORY,
            ERRORS,
            kit_id,
            "History's kit with id={} does not exist.".format(kit.id),
        )


def check_history_field_type(log, type, history_id):
    if type is None:
        add_log(log, HISTORY, ERRORS, history_id, "History's type is undefined")
        return
    if type not in HISTORY_TYPE:
        add_log(log, HISTORY, ERRORS, history_id, "History's type is invalid")


def check_history_field_person(log, person, history_id):
    if person is None:
        add_log(log, HISTORY, ERRORS, history_id, "History's person is undefined")
        return
    if not User.objects.filter(id=person.id).exists():
        add_log(
            log,
            HISTORY,
            ERRORS,
            history_id,
            "History's person with id={} does not exist.".format(person.id),
        )


def check_history_field_order_id(log, order_id, history_id):
    if order_id is None:
        add_log(log, HISTORY, ERRORS, history_id, "History's order_id is undefined")
        return
    if not isinstance(order_id, int):
        add_log(
            log, HISTORY, ERRORS, history_id, "History's order_id is not an integer"
        )

    if not Order.objects.filter(id=order_id).exists():
        add_log(
            log,
            HISTORY,
            ERRORS,
            history_id,
            "History's order with id={} does not exist.".format(order_id),
        )


def check_loan_history_not_none(log, loan_history, history_id):
    if loan_history is None:
        add_log(
            log,
            HISTORY,
            ERRORS,
            history_id,
            "Loan History for loan with id={} is undefined".format(history_id),
        )
        return False
    return True
