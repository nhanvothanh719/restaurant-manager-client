// POST: /api/auth/set-session
export async function POST(request: Request) {
  const data = await request.json();
  const { sessionToken, expiresAt } = data;

  if (!sessionToken) {
    return Response.json({ message: "Missing session token" }, { status: 400 });
  }
  const expiredAt = new Date(expiresAt).toUTCString();

  // Gửi header Set-Cookie này trong HTTP response về browser của người dùng
  // MEMO: Nếu không set `Path=/` thì thuộc tính path của cookie sẽ là `/api`
  // MEMO: HttpOnly để client không thể dùng JS lấy được giá trị cookie
  return Response.json(data, {
    status: 200,
    headers: {
      "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly; Expires=${expiredAt}; SameSite=Lax; Secure`,
    },
  });
}
