import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.resolve(process.cwd(), 'agents/config.json');

export async function GET() {
  try {
    const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const json = JSON.parse(data);
    return NextResponse.json(json);
  } catch (e: unknown) {
    console.error('failed to read config', e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(body, null, 2));
    return NextResponse.json(body);
  } catch (e: unknown) {
    console.error('failed to write config', e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
