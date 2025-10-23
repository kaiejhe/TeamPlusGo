const API_BASE = "https://plusadmin.pages.dev/api/functions";

export async function Card(body) {
  const payload = typeof body === "string" ? body : JSON.stringify(body);

  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: payload,
  });

  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    // 保留空数据，交给后续逻辑处理
  }

  if (!response.ok) {
    const message = data?.msg || "验证失败或服务器繁忙，请稍后再试。";
    throw new Error(message);
  }

  return data;
}

