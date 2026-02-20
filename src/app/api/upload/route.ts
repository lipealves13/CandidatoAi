import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (
                pathname: string,
                /* clientPayload?: string, */
            ) => {
                // Authenticate the user/tenant here in production
                // const { user, tenantId } = await getServerSession(...)
                const tenantId = "mock-tenant-123"; // Demonstration ID

                // Return the client payload to attach the tenant to the generic Vercel Blob metadata
                return {
                    allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
                    tokenPayload: JSON.stringify({
                        tenantId: tenantId,
                    }),
                };
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {
                // This is called AFTER the upload is completed on Vercel's end
                console.log('blob upload completed', blob, tokenPayload);

                try {
                    // const { tenantId } = JSON.parse(tokenPayload || '{}');
                    // Automatically save the asset URL to the database or trigger AI background processing
                    // Example: prisma.campaignData.update({...})
                } catch (error) {
                    throw new Error('Could not update database line after successful upload');
                }
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 },
        );
    }
}
