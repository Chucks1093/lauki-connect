import { routeAgentRequest } from "agents";
import { z } from "zod";
import { ProfileSearchAgent } from "@/profile-search-agent";
import { searchProfileCandidates } from "@/tools/profile-search";
import type { AgentEnv } from "@/types";

export { ProfileSearchAgent };

const searchBodySchema = z.object({
  query: z.string().trim().min(3),
  limit: z.number().int().min(1).max(5).optional(),
});

export default {
  async fetch(request: Request, env: AgentEnv) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/search") {
      const body = await request.json().catch(() => null);
      const parsedBody = searchBodySchema.safeParse(body);

      if (!parsedBody.success) {
        return Response.json(
          {
            success: false,
            message: "Search query must be at least 3 characters.",
          },
          { status: 400 },
        );
      }

      try {
        const profiles = await searchProfileCandidates({
          ...parsedBody.data,
          env,
        });

        return Response.json({
          success: true,
          message:
            profiles.length > 0
              ? "Profiles found successfully"
              : "No profiles found from the currently available providers.",
          data: profiles,
        });
      } catch (error) {
        return Response.json(
          {
            success: false,
            message:
              error instanceof Error ? error.message : "Profile search failed unexpectedly.",
            data: [],
          },
          { status: 502 },
        );
      }
    }

    const routed = await routeAgentRequest(request, env);

    if (routed) {
      return routed;
    }

    return new Response("Lauki Connect agent is running", { status: 200 });
  },
};
