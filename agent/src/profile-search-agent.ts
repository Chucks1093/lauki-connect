import { convertToModelMessages, pruneMessages, stepCountIs, streamText, tool } from "ai";
import { AIChatAgent } from "@cloudflare/ai-chat";
import { createWorkersAI } from "workers-ai-provider";
import { z } from "zod";
import { searchProfileCandidates } from "@/tools/profile-search";
import type { AgentEnv, ProfileSearchAgentState } from "@/types";

export class ProfileSearchAgent extends AIChatAgent<AgentEnv, ProfileSearchAgentState> {
  initialState: ProfileSearchAgentState = {
    lastQuery: null,
  };

  async onChatMessage() {
    const workersai = createWorkersAI({ binding: this.env.AI });
    const result = streamText({
      model: workersai(
        this.env.CLOUDFLARE_AI_MODEL || "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
      ),
      messages: pruneMessages({
        messages: await convertToModelMessages(this.messages),
        reasoning: "before-last-message",
        toolCalls: "before-last-message",
      }),
      system: [
        "You are the Lauki Connect profile discovery agent.",
        "Find the best public-facing builders, investors, operators, or partners for the user's request.",
        "Always use the search_profiles tool before answering.",
        "Return concise ranked recommendations with why each person fits.",
      ].join(" "),
      temperature: 0.2,
      maxOutputTokens: 700,
      stopWhen: stepCountIs(4),
      tools: {
        search_profiles: tool({
          description:
            "Search live public web sources and return the best matching web3 profiles for the request.",
          inputSchema: z.object({
            query: z.string().min(3),
            limit: z.number().int().min(1).max(5).default(5),
          }),
          execute: async ({ query, limit }) => {
            this.setState({
              ...this.state,
              lastQuery: query,
            });

            return {
              profiles: await searchProfileCandidates({
                query,
                limit,
                env: this.env,
              }),
            };
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  }
}
