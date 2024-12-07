import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const connection = await createConnection();
  
  try {
    const body = await request.json();
    const { content, password } = body;

    if (!content?.trim()) {
      return NextResponse.json({ 
        error: 'Failed to update thought', 
        details: 'Content is required' 
      }, { status: 400 });
    }

    // Verify current password
    const [thought] = await connection.execute(
      'SELECT password FROM thoughts WHERE id = ?',
      [params.id]
    );

    if (!thought || !thought[0]) {
      return NextResponse.json({ 
        error: 'Thought not found' 
      }, { status: 404 });
    }

    if (thought[0].password !== password) {
      return NextResponse.json({ 
        error: 'Invalid password' 
      }, { status: 401 });
    }

    // Update thought
    const query = `
      UPDATE thoughts 
      SET 
        content = ?,
        updated_at = NOW()
      WHERE id = ?
    `;
    
    await connection.execute(query, [
      content.trim(),
      params.id
    ]);

    return NextResponse.json({
      message: 'Thought updated successfully'
    });

  } catch (error) {
    console.error('Error updating thought:', error);
    return NextResponse.json({ 
      error: 'Failed to update thought', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  } finally {
    await connection.end();
  }
}
