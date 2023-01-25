import {TelegrafContext} from "telegraf/typings/context";

export async function handleTestCommand(ctx: TelegrafContext) {
    const COMMAND = "/test";
    const { message } = ctx;

    let reply = "Hello there! Awaiting your service";

    const didReply = await ctx.reply(reply, {
        reply_to_message_id: message?.message_id,
    });

    if (didReply) {
        console.log(`Reply to ${COMMAND} command sent successfully.`);
    } else {
        console.error(
            `Something went wrong with the ${COMMAND} command. Reply not sent.`
        );
    }
}
export async function handleOnMessage(ctx: TelegrafContext) {
    const { message } = ctx;

    const isGroup =
        message?.chat.type === "group" || message?.chat.type === "supergroup";

    if (isGroup) {
        await ctx.reply("This bot is only available in private chats.");
        return;
    }

    const telegramUsername = message?.from?.username;
    const reply = "a message was sent";

    await ctx.reply(reply, {
        reply_to_message_id: message?.message_id,
    });
}