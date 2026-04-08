const API_URL = "http://localhost:3001"

export async function startSession(tableId: string) {
  const res = await fetch(`${API_URL}/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      tableId,
    }),
  })

  if (!res.ok) {
    throw new Error("Failed to start session")
  }

  return res.json()
}