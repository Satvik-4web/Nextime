import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');

    let query = supabase.from('replies').select('*').order('created_at', { ascending: true });
    
    if (questionId) {
      query = query.eq('question_id', questionId);
    }

    const { data: replies, error } = await query;

    if (error) throw error;

    return NextResponse.json(replies);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch replies' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.question_id || !body.body || !body.author_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('replies')
      .insert([
        {
          question_id: body.question_id,
          author_id: body.author_id,
          author_name: body.author_name,
          body: body.body,
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Increment reply count on the question
    await supabase.rpc('increment_reply_count', { q_id: body.question_id });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create reply' }, { status: 500 });
  }
}
