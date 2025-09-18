// POST: /api/auth/set-session
export async function POST(request: Request) {
  const res = await request.json();
  const sessionToken = res.payload?.data?.token;

  if (!sessionToken) {
    return Response.json({ message: 'Missing session token' }, { status: 400 });
  }

  // MEMO: Nếu không set ``Path=/` thì thuộc tính path của cookie sẽ là `/api`
  // MEMO: HttpOnly để client không thể dùng JS lấy được giá trị cookie
  return Response.json(
    res.payload,
    {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly`,
      },
    }
  );
}
