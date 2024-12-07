import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';
import { ADMIN_PASSWORD } from '@/lib/admin';

// Mark route as dynamic
export const dynamic = 'force-dynamic';
// Disable response caching
export const revalidate = 0;

// Helper function to format date for MySQL
function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

export async function POST(request: Request) {
  let connection;
  try {
    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { headers });
    }

    console.log('POST request received');
    
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    // Validate required fields
    const { receiver, content, username, password } = body;
    if (!content?.trim()) {
      return NextResponse.json({ 
        error: 'Failed to create thought', 
        details: 'Content is required'
      }, { 
        status: 400,
        headers 
      });
    }
    if (!username?.trim() || !password) {
      return NextResponse.json({ 
        error: 'Failed to create thought', 
        details: 'Username and password are required'
      }, { 
        status: 400,
        headers 
      });
    }
    
    console.log('Connecting to database...');
    connection = await createConnection();
    console.log('Connected to database');
    
    const query = `
      INSERT INTO thoughts 
        (receiver, content, username, password, date, created_at) 
      VALUES 
        (?, ?, ?, ?, NOW(), NOW())
    `;
    
    console.log('Executing query with parameters:', {
      receiver,
      contentLength: content.length,
      username
    });
    
    const [result] = await connection.execute(query, [
      receiver || '',
      content.trim(),
      username.trim(),
      password
    ]);
    
    console.log('Query executed successfully:', result);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Thought created successfully',
      result 
    }, {
      headers
    });
  } catch (error) {
    console.error('Error in POST /api/thoughts:', error);
    // Log the full error stack
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json({ 
      error: 'Failed to create thought', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } finally {
    if (connection) {
      try {
        await connection.release();
        console.log('Database connection released');
      } catch (releaseError) {
        console.error('Error releasing connection:', releaseError);
      }
    }
  }
}

export async function GET() {
  let connection;
  try {
    console.log('GET request received');
    connection = await createConnection();
    console.log('Database connected');
    
    const query = `
      SELECT 
        id,
        receiver,
        content,
        DATE_FORMAT(date, '%Y-%m-%d %H:%i:%s') as date,
        username,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at 
      FROM thoughts 
      ORDER BY created_at DESC
    `;
    
    console.log('Executing query:', query);
    const [rows] = await connection.execute(query);
    console.log('Query results:', rows);
    
    return NextResponse.json(rows, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in GET /api/thoughts:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch thoughts',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } finally {
    if (connection) {
      try {
        await connection.release();
        console.log('Database connection released');
      } catch (releaseError) {
        console.error('Error releasing connection:', releaseError);
      }
    }
  }
}

export async function DELETE(request: Request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const password = searchParams.get('password');

    if (!id || !password) {
      return NextResponse.json({ 
        error: 'Failed to delete thought', 
        details: 'ID and password are required'
      }, { 
        status: 400 
      });
    }

    connection = await createConnection();

    // Check if admin password
    const isAdmin = password === ADMIN_PASSWORD;

    if (!isAdmin) {
      // If not admin, verify the thought's password
      const [rows]: any = await connection.execute(
        'SELECT id FROM thoughts WHERE id = ? AND password = ?',
        [id, password]
      );

      if (!rows || rows.length === 0) {
        return NextResponse.json({ 
          error: 'Failed to delete thought', 
          details: 'Invalid password'
        }, { 
          status: 403 
        });
      }
    }

    // If admin or password is correct, delete the thought
    const [result] = await connection.execute(
      'DELETE FROM thoughts WHERE id = ?',
      [id]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Thought deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/thoughts:', error);
    return NextResponse.json({ 
      error: 'Failed to delete thought',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500 
    });
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (releaseError) {
        console.error('Error releasing connection:', releaseError);
      }
    }
  }
}
