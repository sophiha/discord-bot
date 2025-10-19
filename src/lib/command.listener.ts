/**
 * Copyright (c) Statsify
 *
 * This source code is licensed under the GNU GPL v3 license found in the
 * LICENSE file in the root directory of this source tree.
 * https://github.com/Statsify/statsify/blob/main/LICENSE
 */

import {
  AbstractCommandListener,
  CommandContext,
  type CommandResolvable,
  Interaction,
} from "@statsify/discord";
import { config } from "@statsify/util";
import type { InteractionServer, RestClient, WebsocketShard } from "tiny-discord";

const applicationId = await config("discordBot.applicationId");
const port = await config("discordBot.port", { required: false });

export class CommandListener extends AbstractCommandListener {
  private static instance: CommandListener;

  private constructor(
    client: WebsocketShard | InteractionServer,
    rest: RestClient,
    commands: Map<string, CommandResolvable>
  ) {
    super(client as InteractionServer, rest, commands, applicationId, port!);
  }

  protected async onCommand(interaction: Interaction): Promise<void> {
    const data = interaction.getData();
    const command = this.commands.get(data.name);

    if (!command) return;

    const [resolvedCommand, resolvedData, commandName] = this.getCommandAndData(command, data);
    const context = new CommandContext(this, interaction, resolvedData);

    await this.executeCommand({
      commandName,
      command: resolvedCommand,
      context,
    });
  }

  public static create(
    client: WebsocketShard | InteractionServer,
    rest: RestClient,
    commands: Map<string, CommandResolvable>
  ) {
    this.instance = new CommandListener(client, rest, commands);
    return this.instance;
  }

  public static getInstance() {
    if (!this.instance) throw new Error("CommandListener has not been initialized");
    return this.instance;
  }
}