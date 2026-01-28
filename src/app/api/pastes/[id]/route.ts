import { NextRequest, NextResponse } from 'next/server';
import { getPaste } from '@/lib/pastes';
import { getCurrentTime } from '@/lib/time';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const now = getCurrentTime(req);
        const result = await getPaste(params.id, now);

        if (!result) {
            return NextResponse.json({ error: 'Paste not found or unavailable' }, { status: 404 });
        }

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Get paste failed:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
