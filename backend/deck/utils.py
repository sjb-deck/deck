import boto3
from django.conf import settings
from botocore.exceptions import NoCredentialsError, ClientError


def delete_file(file_path):
    try:
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
        )
        s3_client.delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=file_path)
    except NoCredentialsError:
        print("Credentials not available", flush=True)
    except ClientError as e:
        print(e, flush=True)
