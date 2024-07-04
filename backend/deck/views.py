import boto3
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.http import JsonResponse
from botocore.exceptions import NoCredentialsError
from django.shortcuts import redirect
from .utils import delete_file


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_presigned_url_for_upload(request):
    try:
        file_name = request.data.get("fileName")
        file_type = request.data.get("fileType")
        folder_name = request.data.get("folderName")

        s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
        )

        key = f"{settings.ENV}/{folder_name}/{file_name}"

        presigned_url = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
                "Key": key,
                "ContentType": file_type,
            },
            ExpiresIn=360,
        )

        return Response(
            {"url": presigned_url, "key": file_name}, status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response(
            {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_presigned_url(request, filepath):
    s3_client = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME,
    )
    try:
        presigned_url = s3_client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
                "Key": f"{settings.ENV}/{filepath}",
            },
            ExpiresIn=3600,
        )
        return redirect(presigned_url)
    except NoCredentialsError:
        return JsonResponse({"error": "Credentials not available"}, status=403)
