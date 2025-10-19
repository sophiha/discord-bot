/**
 * Copyright (c) Statsify
 *
 * This source code is licensed under the GNU GPL v3 license found in the
 * LICENSE file in the root directory of this source tree.
 * https://github.com/Statsify/statsify/blob/main/LICENSE
 */

import { CommandBuilder, CommandPoster, type CommandResolvable } from "@statsify/discord";
import { CommandListener } from "#lib/command.listener";
import { Container } from "typedi";
import { FontLoaderService } from "#services";
import { InteractionServer, RestClient, WebsocketShard } from "tiny-discord";
import { Logger } from "@statsify/logger";
import { TextCommand } from "./commands/minecraft/text.command.js";
import { config } from "@statsify/util";

const logger = new Logger("discord-bot");
const handleError = logger.error.bind(logger);

process.on("uncaughtException", handleError);
process.on("unhandledRejection", handleError);

await Container.get(FontLoaderService).init();

const rest = new RestClient({ token: await config("discordBot.token"), timeout: 60 * 1000 });
Container.set(RestClient, rest);

const textCommand = CommandBuilder.scan(Container.get(TextCommand), TextCommand);
const commands = new Map<string, CommandResolvable>([[textCommand.name, textCommand]]);

const poster = Container.get(CommandPoster);

await poster.post(
  commands,
  await config("discordBot.applicationId"),
  await config("discordBot.testingGuild", { required: false })
);

const port = await config("discordBot.port", { required: false });

const listener = CommandListener.create(
  port ?
    new InteractionServer({ key: await config("discordBot.publicKey")! }) :
    new WebsocketShard({ token: await config("discordBot.token"), intents: 1 }),
  rest,
  commands
);

await listener.listen();