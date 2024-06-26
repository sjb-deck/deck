import requests
from requests.auth import HTTPBasicAuth
from decouple import config

"""
Uploads a file to the nextcloud server
Note: If there is a file with the same name, it will be overwritten
"""


def upload_file(file_path, file_content):
    username = ""  # TODO: Update after S3 integration
    password = ""  # TODO: Update after S3 integration
    nextcloud_url = (
        f"https://nextcloud.nhhs-sjb.org/remote.php/dav/files/{username}/Shared/deck/"
    )

    full_url = nextcloud_url + file_path

    response = requests.put(
        full_url, data=file_content, auth=HTTPBasicAuth(username, password)
    )

    if (
        response.status_code == 201 or response.status_code == 204
    ):  # 201 Created or 204 Replace existing file
        return file_path
    else:
        raise Exception(f"Failed to upload file. Status code: {response.status_code}")


def delete_file(file_path):
    username = ""  # TODO: Update after S3 integration
    password = ""  # TODO: Update after S3 integration
    nextcloud_url = (
        f"https://nextcloud.nhhs-sjb.org/remote.php/dav/files/{username}/Shared/deck/"
    )

    full_url = nextcloud_url + file_path

    response = requests.delete(full_url, auth=HTTPBasicAuth(username, password))

    if response.status_code == 204:  # 204 No Content
        return file_path
    else:
        raise Exception(f"Failed to delete file. Status code: {response.status_code}")
