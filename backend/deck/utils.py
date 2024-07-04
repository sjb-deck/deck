import boto3
from django.conf import settings
from botocore.exceptions import NoCredentialsError, ClientError


def delete_file(file_path):
    try:
        if settings.ENV == "prod":
            file_path = f"prod/{file_path}"
        else:
            file_path = f"staging/{file_path}"

        s3_client = get_s3_client()
        s3_client.delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=file_path)
    except NoCredentialsError:
        print("Credentials not available", flush=True)
    except ClientError as e:
        print(e, flush=True)


def get_s3_client():
    if settings.ENV == "prod":
        # In production, use IAM roles
        return boto3.client(
            "s3",
            region_name=settings.AWS_S3_REGION_NAME,
        )
    else:
        # In staging, use access keys
        return boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
        )
