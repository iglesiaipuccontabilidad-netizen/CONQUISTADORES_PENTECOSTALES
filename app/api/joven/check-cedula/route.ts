import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Implementar lógica para verificar cédula
  return NextResponse.json({ message: 'Check cedula endpoint' });
}