export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/test") {
      try {
        const result = await env.DB
          .prepare("SELECT COUNT(*) AS count FROM templates")
          .first();

        return Response.json({
          success: true,
          database: "excelmodels-db",
          templates: result.count
        });
      } catch (error) {
        return Response.json(
          {
            success: false,
            error: error.message
          },
          { status: 500 }
        );
      }
    }

    if (url.pathname === "/api/templates") {
      try {
        const { results } = await env.DB
          .prepare(`
            SELECT id, name, slug, category, description,
                   price, preview_url, is_free, created_at
            FROM templates
            WHERE is_published = 1
            ORDER BY created_at DESC
          `)
          .all();

        return Response.json({
          success: true,
          templates: results
        });
      } catch (error) {
        return Response.json(
          {
            success: false,
            error: error.message
          },
          { status: 500 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};
