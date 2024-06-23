from inventory.kits.routines.utils import *
from inventory.kits.routines.constants import *


# Blueprint Check
def check_blueprint(log):
    blueprints = Blueprint.objects.all()
    for blueprint in blueprints:
        # Check fields, type and definition only
        check_field_name(log, BLUEPRINT, blueprint.name, blueprint.id, "Blueprint name")
        check_blueprint_field_archived(log, blueprint.archived, blueprint.id)
        check_blueprint_field_complete_content(
            log, blueprint.complete_content, blueprint.id
        )

        # Check content requirements
        for item in blueprint.complete_content:
            check_item_id_quantity(log, item, blueprint.id)

    log["isChecked"]["blueprint"] = True


# Kit Check
def check_kit(log):
    kits = Kit.objects.all()
    for kit in kits:
        # Check fields, type and definition only
        check_field_name(log, KIT, kit.name, kit.id, "Kit name")
        check_kit_field_blueprint(log, kit.blueprint, kit.id)
        check_kit_field_status(log, kit.status, kit.id)
        check_field_json(log, KIT, kit.content, kit.id, "Kit content")

        if (kit.name and kit.blueprint and kit.status and kit.content) is not None:
            check_kit_history_match(log, kit)
            check_kit_contents(log, kit)

    log["isChecked"]["kit"] = True


# History Check
# fields check, all exists and valid
# check order_id exists and valid
# check if changes in the order matches the difference between the two affected snapshots
# if loan, check return date is after due date
def check_history(log):
    histories = History.objects.all()
    for history in histories:
        # Check fields, type and definition only
        check_history_field_kit(log, history.kit, history.id)
        check_history_field_type(log, history.type, history.id)
        check_field_date(log, HISTORY, history.date, history.id, "History date")
        check_history_field_person(log, history.person, history.id)
        check_field_json(log, HISTORY, history.snapshot, history.id, "History snapshot")
        check_history_field_order_id(log, history.order_id, history.id)

        if history.type and history.type == LOAN:
            loan_history = LoanHistory.objects.get(id=history.id)
            if check_loan_history_not_none(log, loan_history, history.id):
                check_field_name(
                    log,
                    HISTORY,
                    loan_history.loanee_name,
                    loan_history.id,
                    "Loanee name",
                )
                check_field_date(
                    log, HISTORY, loan_history.due_date, loan_history.id, "Due date"
                )
                check_field_date(
                    log,
                    HISTORY,
                    loan_history.return_date,
                    loan_history.id,
                    "Return date",
                )

    log["isChecked"]["history"] = True


def initialize_log():
    return {
        ERRORS: [],
        WARNINGS: [],
        INFO: [],
        "isChecked": {
            BLUEPRINT: False,
            KIT: False,
            HISTORY: False,
        },
        "summary": None,
    }


def run_routine():
    log = initialize_log()
    check_blueprint(log)
    check_kit(log)
    check_history(log)
    return log
