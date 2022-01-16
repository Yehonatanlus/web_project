import requests


def send_register_request(server_addr, user) -> bool:
    resp = requests.post(f"http://{server_addr}/users", json=user)
    status = resp.json()
    return status['success']


def send_remove_request(server_addr, user) -> bool:
    resp = requests.delete(f"http://{server_addr}/users", json=user)
    status = resp.json()
    return status['success']


def send_poll_answer(server_addr, vote):
    resp = requests.post(f"http://{server_addr}/votes", json=vote)
    status = resp.json()
    return status['success']
