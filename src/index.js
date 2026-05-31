const CHZZK_SEARCH_URL = "https://api.chzzk.naver.com/service/v1/search/channels";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/search") {
      return searchChannels(url);
    }

    return env.ASSETS.fetch(request);
  }
};

async function searchChannels(requestUrl) {
  const keyword = (requestUrl.searchParams.get("keyword") || "").trim();
  const offset = normalizeInteger(requestUrl.searchParams.get("offset"), 0, 0, 1000);
  const size = normalizeInteger(requestUrl.searchParams.get("size"), 8, 1, 20);

  if (!keyword) {
    return json({ code: 400, message: "keyword is required" }, 400);
  }

  const upstream = new URL(CHZZK_SEARCH_URL);
  upstream.searchParams.set("keyword", keyword);
  upstream.searchParams.set("offset", String(offset));
  upstream.searchParams.set("size", String(size));

  try {
    const response = await fetch(upstream, {
      headers: {
        Accept: "application/json",
        Origin: "https://chzzk.naver.com",
        Referer: "https://chzzk.naver.com/"
      },
      signal: AbortSignal.timeout(8000)
    });

    if (!response.ok) {
      return json({ code: response.status, message: "CHZZK upstream rejected the search request" }, 502);
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=30"
      }
    });
  } catch (error) {
    return json({
      code: 502,
      message: error?.name === "TimeoutError" ? "CHZZK search request timed out" : "CHZZK search request failed"
    }, 502);
  }
}

function normalizeInteger(value, fallback, min, max) {
  const number = Number.parseInt(value, 10);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

function json(body, status) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" }
  });
}
