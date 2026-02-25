export interface AgentContext {
  workspace: string; // base url for API calls
  config?: any;       // optional configuration (webhooks, credentials)
}

export abstract class Agent {
  constructor(protected ctx: AgentContext) {}
  abstract run(args?: any): Promise<any>;
}
