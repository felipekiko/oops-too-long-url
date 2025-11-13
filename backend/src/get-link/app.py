import os, boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

def lambda_handler(event, context):
    link_id = event['pathParameters']['id']
    response = table.get_item(Key={'id': link_id})
    item = response.get('Item')

    if not item:
        return {'statusCode': 404, 'body': 'Link not found'}

    return {
        'statusCode': 301,
        'headers': {'Location': item['originalUrl']}
    }
