import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .order('year', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, count: data?.length || 0, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Error fetching history', error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = { year: Number(body.year), event: String(body.event) }

    const { data, error } = await supabase
      .from('history')
      .insert([payload])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, message: 'History item created', data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Error creating history item', error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, year, event } = body
    if (!id) return NextResponse.json({ success: false, message: 'Missing id' }, { status: 400 })

    const { data, error } = await supabase
      .from('history')
      .update({ year: Number(year), event: String(event) })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, message: 'History item updated', data })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Error updating history item', error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ success: false, message: 'Missing id' }, { status: 400 })

    const { error } = await supabase.from('history').delete().eq('id', id)
    if (error) throw error

    return NextResponse.json({ success: true, message: 'History item deleted' })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Error deleting history item', error: error.message }, { status: 500 })
  }
}



