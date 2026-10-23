import {PutBucketAbacCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3'

function getClientInfo(){
    const endpoint = process.env.AWS_ENDPOINT_URL_S3
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    const region = process.env.AWS_REGION

    if(!region || !accessKeyId || !secretAccessKey) throw new Error("storage credentials are missing")

    return new S3Client({
        region,
        endpoint,
        credentials: {accessKeyId, secretAccessKey},
        forcePathStyle: true
    })

}


function async function uploadBuffer(
    buffer: Buffer,
    contentType ="image/jpeg"
): Promise<{imageUrl: string, publicId: string}>{
    const bucket = process.env.STORAGE_BUCKET;
    const endpoint = process.env.AWS_ENDPOINT_URL_S3;

    if(!bucket || !endpoint){
        throw new Error("Storage credentials are missing - Endpoint & Bucket")
    }

    await getClientInfo().send(
        new PutObjectCommand({
            Bucket: bucket,
            Key : 
        })
    )
}