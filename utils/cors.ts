import { NextResponse } from 'next/server'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

export function createCorsResponse(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: corsHeaders,
  })
}

export function createCorsOptionsResponse() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

export function createCorsErrorResponse(message: string, status = 400) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: corsHeaders,
    }
  )
}