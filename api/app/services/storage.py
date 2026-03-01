from __future__ import annotations

import os

try:
    import boto3
except Exception:  # pragma: no cover - optional in local env
    boto3 = None


def upload_file_s3(local_path: str, key: str) -> str:
    bucket = os.environ.get("AWS_S3_BUCKET")
    region = os.environ.get("AWS_REGION", "us-east-1")

    if bucket and boto3:
        client = boto3.client("s3", region_name=region)
        client.upload_file(local_path, bucket, key, ExtraArgs={"ContentType": "video/mp4"})
        return f"https://{bucket}.s3.{region}.amazonaws.com/{key}"

    return f"https://example.com/generated/{key}"
