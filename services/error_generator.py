import random

messages = [
    "fraction_max_mesh must be larger than fraction_min_mesh",
    "fraction_number must be a positive integer",
    "scan_id must be alphanumeric",
    "spliting_ratio must be greater than zero",
    "observation cannot be empty",
    "scanning_operator is required",
    "fraction_min_mesh must be less than fraction_max_mesh",
    "unexpected extra field in data",
    "invalid date format for sampling_date",
    "net_mesh must be a numeric string"
]

fields = [
    "fraction_max_mesh",
    "fraction_number",
    "scan_id",
    "spliting_ratio",
    "observation",
    "scanning_operator",
    "fraction_min_mesh",
    "extra_field",
    "sampling_date",
    "net_mesh"
]

errors = [
    {
        "type": "value_error",
        "loc": ["body", "data", field],
        "msg": msg
    }
    for field, msg in random.sample(list(zip(fields, messages)), k=5)
]

print(errors)

