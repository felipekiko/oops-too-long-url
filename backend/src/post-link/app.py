import os, json, uuid, boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

def lambda_handler(event, context):
    body = json.loads(event.get('body', '{}'))
    original_url = body.get('url')

    if not original_url:
        return {'statusCode': 400, 'body': json.dumps({'error': 'Missing URL'})}

    short_id = str(uuid.uuid4())[:6]
    table.put_item(Item={'id': short_id, 'originalUrl': original_url})

    return {
        'statusCode': 200,
        'body': json.dumps({
            'id': short_id,
            'shortUrl': f"/{short_id}"
        })
    }
