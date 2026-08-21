from rest_framework.views import exception_handler


def _first_error(value) -> str:
    if isinstance(value, dict):
        for item in value.values():
            return _first_error(item)
    if isinstance(value, (list, tuple)) and value:
        return _first_error(value[0])
    return str(value)


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None or response.status_code < 400:
        return response

    original_data = response.data
    if isinstance(original_data, dict) and set(original_data) == {"detail"}:
        return response

    response.data = {
        "detail": _first_error(original_data),
        "errors": original_data,
    }
    return response

